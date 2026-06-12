import { cookies } from "next/headers";
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

/**
 * Monta o header `Cookie` a partir dos cookies da requisição atual do Next.js.
 * Usado exclusivamente em Server Components e Server Actions para propagar
 * a sessão do ASP.NET Core Identity de forma transparente.
 */
const buildCookieHeader = async (): Promise<string> => {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
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
      const cookieHeader = await buildCookieHeader();

      const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
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
      const cookieHeader = await buildCookieHeader();

      const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        // Comandos nunca devem ser cacheados.
        cache: "no-store",
      });

      clearTimeout(timeoutId);
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
  // Sucesso sem corpo (ex: 204 No Content em DELETE).
  if (response.status === 204) {
    return { success: true, data: undefined as T, status: 204 };
  }

  if (response.ok) {
    // Lê o body como texto primeiro — o body stream só pode ser consumido uma vez.
    // Isso permite lidar com respostas plain-text (ex: "Healthy") sem perder o dado.
    const text = await response.text();

    if (!text.trim()) {
      // Corpo vazio em resposta 2xx — tratamos como sucesso sem dados.
      return { success: true, data: undefined as T, status: response.status };
    }

    try {
      // Tenta parsear como JSON. Se o servidor responder com plain text
      // (ex: Healthy sem aspas), JSON.parse lança SyntaxError.
      const data = JSON.parse(text) as T;
      return { success: true, data, status: response.status };
    } catch {
      // Resposta 2xx com corpo plain-text (não-JSON): retorna o texto puro.
      // O consumidor (ex: page.tsx) é responsável por tipar e interpretar.
      return { success: true, data: text as T, status: response.status };
    }
  }

  // Resposta de erro (4xx / 5xx) → parseia o ProblemDetails.
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
