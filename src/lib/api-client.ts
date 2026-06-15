import { cookies } from "next/headers";
import { LOCALE_COOKIE } from "@/lib/i18n-config";
import type { ApiResponse } from "@/types/http/api-response";
import type { ProblemDetails } from "@/types/http/problem-details";


// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const TIMEOUT_MS = 8_000;

const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
  // Falha rápida em desenvolvimento: evita erros silenciosos de rede.
  console.error(
    "[api-client] ⚠️  A variável de ambiente API_BASE_URL não está definida. " +
    "Verifique o arquivo .env.local na raiz do projeto.",
  );
}

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

const buildHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join("; ");
  const locale = cookieStore.get(LOCALE_COOKIE)?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

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

/**
 * Constrói um `ProblemDetails` sintético para representar falhas de rede
 * ou timeout que não possuem um corpo HTTP para parsear.
 */
const buildNetworkError = (
  status: number,
  title: string,
  detail: string,
): ProblemDetails => ({ status, title, detail });

/**
 * Tenta parsear o corpo da resposta como `ProblemDetails`. Se o corpo
 * estiver vazio ou malformado, retorna um `ProblemDetails` sintético.
 */
const parseProblemDetails = async (
  response: Response,
): Promise<ProblemDetails> => {
  try {
    const body = await response.json();
    // O .NET pode retornar tanto o formato padrão do ProblemDetails quanto
    // um objeto customizado do Result pattern — ambos têm `title` ou `detail`.
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
      "Não foi possível parsear o corpo da resposta de erro.",
    );
  }
};

// ---------------------------------------------------------------------------
// Opções do cliente
// ---------------------------------------------------------------------------

type QueryOptions = {
  /** Tags do Next.js para On-Demand Revalidation (`revalidateTag`). */
  tags?: string[];
  /** Cache behavior do Next.js (ex: `'force-cache'`, `'no-store'`). */
  cache?: RequestCache;
};

type CommandOptions = {
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
};

// ---------------------------------------------------------------------------
// Implementação do cliente
// ---------------------------------------------------------------------------

/**
 * Cliente HTTP tipado para comunicação com a API C# do MediaTracker.
 *
 * - `api.query`   → Requisições GET (Server Components, cache nativo do Next.js).
 * - `api.command` → Mutações POST/PUT/PATCH/DELETE (Server Actions).
 *
 * Ambos os métodos:
 * - Injetam automaticamente os cookies da sessão (ASP.NET Core Identity).
 * - Aplicam um timeout de 8s com `AbortController`.
 * - Retornam `ApiResponse<T>` — nunca lançam exceções para o consumidor.
 */
export const api = {
  /**
   * Realiza uma requisição GET tipada, integrada ao sistema de cache do Next.js.
   *
   * @param path  Caminho relativo ao `API_BASE_URL` (ex: `'/health'`).
   * @param opts  Tags de revalidação e estratégia de cache.
   */
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
        // Integração com o sistema de cache do Next.js 16:
        // `next.tags` habilita a revalidação sob demanda via `revalidateTag()`.
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

  /**
   * Realiza uma requisição de mutação (POST, PUT, PATCH ou DELETE).
   * Destinado a ser usado dentro de **Server Actions**.
   *
   * @param path  Caminho relativo ao `API_BASE_URL`.
   * @param body  Corpo da requisição (será serializado como JSON).
   * @param opts  Método HTTP (padrão: `POST`).
   */
  command: async <T>(
    path: string,
    body?: unknown,
    opts: CommandOptions = {},
  ): Promise<ApiResponse<T>> => {
    const { method = "POST" } = opts;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const headers = await buildHeaders();

      const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        signal: controller.signal,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        // Comandos nunca devem ser cacheados.
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

// ---------------------------------------------------------------------------
// Parse da resposta
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Tratamento de erros de rede / timeout
// ---------------------------------------------------------------------------

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
