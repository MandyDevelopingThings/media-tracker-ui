import { cookies } from "next/headers";
import { LOCALE_COOKIE } from "@/lib/i18n-config";
import type { ApiResponse } from "@/types/http/api-response";
import type { ProblemDetails } from "@/types/http/problem-details";

const TIMEOUT_MS = 8_000;

const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
  
  console.error(
    "[api-client] ⚠️  A variável de ambiente API_BASE_URL não está definida. " +
    "Verifique o arquivo .env.local na raiz do projeto.",
  );
}

const buildHeaders = async (isFormData = false): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join("; ");
  const locale = cookieStore.get(LOCALE_COOKIE)?.value;

  const headers: Record<string, string> = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (cookieHeader) {
    headers["Cookie"] = cookieHeader;
  }

  if (locale) {
    headers["Accept-Language"] = locale;
  }

  return headers;
};

const forwardCookies = async (response: Response): Promise<void> => {
  const setCookies = response.headers.getSetCookie();
  if (setCookies.length === 0) return;

  const cookieStore = await cookies();

  for (const cookieStr of setCookies) {
    const parts = cookieStr.split(';').map(p => p.trim());
    const [nameValue, ...optionsParts] = parts;
    const splitIndex = nameValue.indexOf('=');
    if (splitIndex === -1) continue;

    const name = nameValue.substring(0, splitIndex);
    const value = nameValue.substring(splitIndex + 1);

    const options: any = {};

    for (const opt of optionsParts) {
      const [optName, ...optValParts] = opt.split('=');
      const optVal = optValParts.join('=');
      const key = optName.toLowerCase();

      if (key === 'expires') options.expires = new Date(optVal);
      if (key === 'max-age') options.maxAge = parseInt(optVal, 10);
      if (key === 'domain') options.domain = optVal;
      if (key === 'path') options.path = optVal || '/';
      if (key === 'secure') options.secure = true;
      if (key === 'httponly') options.httpOnly = true;
      if (key === 'samesite') {
        const val = optVal?.toLowerCase();
        if (val === 'strict' || val === 'lax' || val === 'none') {
          options.sameSite = val;
        }
      }
    }

    if (options.expires && options.expires.getTime() < Date.now()) {
      cookieStore.delete({ name, domain: options.domain, path: options.path });
    } else {
      cookieStore.set(name, value, options);
    }
  }
};

const buildNetworkError = (
  status: number,
  title: string,
  detail: string,
): ProblemDetails => ({ status, title, detail });

const parseProblemDetails = async (
  response: Response,
): Promise<ProblemDetails> => {
  let text = "";
  try {
    text = await response.text();
    if (!text.trim()) {
      return buildNetworkError(
        response.status,
        response.statusText || "Erro",
        "A resposta de erro do servidor está vazia.",
      );
    }
    const body = JSON.parse(text);
    return {
      status: response.status,
      title: (body.title as string) ?? response.statusText,
      detail: body.detail as string | undefined,
      type: body.type as string | undefined,
      instance: body.instance as string | undefined,
      errors: body.errors as Record<string, readonly string[]> | undefined,
    };
  } catch {
    return buildNetworkError(
      response.status,
      response.statusText || "Erro desconhecido",
      text ? `Resposta não-JSON: ${text.substring(0, 100)}` : "Não foi possível parsear o corpo da resposta de erro.",
    );
  }
};

type QueryOptions = {
  
  tags?: string[];
  
  cache?: RequestCache;
};

type CommandOptions = {
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
};

export const api = {
  
  query: async <T>(
    path: string,
    opts: QueryOptions = {},
  ): Promise<ApiResponse<T>> => {
    const { tags, cache } = opts;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const headers = await buildHeaders();

      const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "GET",
        signal: controller.signal,
        headers,

        next: tags ? { tags } : undefined,
        cache: cache,
      });

      clearTimeout(timeoutId);
      return await parseResponse<T>(response);
    } catch (err) {
      clearTimeout(timeoutId);
      return handleFetchError(err);
    }
  },

  command: async <T>(
    path: string,
    body?: unknown,
    opts: CommandOptions = {},
  ): Promise<ApiResponse<T>> => {
    const { method = "POST" } = opts;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const isFormData = body instanceof FormData;
      const headers = await buildHeaders(isFormData);

      const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        signal: controller.signal,
        headers,
        body: isFormData ? (body as FormData) : (body !== undefined ? JSON.stringify(body) : undefined),
        
        cache: "no-store",
      });

      clearTimeout(timeoutId);
      await forwardCookies(response);
      return await parseResponse<T>(response);
    } catch (err) {
      clearTimeout(timeoutId);
      return handleFetchError(err);
    }
  },
} as const;

const parseResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (response.status === 204) {
    return { success: true, data: undefined as T, status: 204 };
  }

  if (response.ok) {
    const text = await response.text();

    if (!text.trim()) {
      return { success: true, data: undefined as T, status: response.status };
    }

    try {
      const data = JSON.parse(text) as T;
      return { success: true, data, status: response.status };
    } catch {
      return { success: true, data: text as T, status: response.status };
    }
  }

  const error = await parseProblemDetails(response);
  return { success: false, error, status: response.status };
};

const handleFetchError = (err: unknown): ApiResponse<never> => {
  if (err instanceof DOMException && err.name === "AbortError") {
    return {
      success: false,
      status: 408,
      error: buildNetworkError(
        408,
        "Request Timeout",
        `A requisição excedeu o limite de ${TIMEOUT_MS / 1000} segundos.`,
      ),
    };
  }

  const detail =
    err instanceof Error ? err.message : "Erro de rede desconhecido.";

  return {
    success: false,
    status: 0,
    error: buildNetworkError(0, "Erro de Conexão", detail),
  };
};
