import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

/**
 * Nome do cookie de sessão gerado pelo ASP.NET Core Identity.
 * Ajuste conforme o valor configurado no back-end C# (DataProtectionTokenProviderOptions).
 */
const SESSION_COOKIE_NAME = ".AspNetCore.Identity.Application";

// ---------------------------------------------------------------------------
// Utilitários de Auth Guard (Opt-in Security)
// ---------------------------------------------------------------------------

/**
 * Guard para rotas **privadas**.
 *
 * Deve ser chamado no topo de Server Components ou Server Actions que exigem
 * autenticação (ex: página do Diário, perfil do usuário).
 *
 * Se o cookie de sessão não existir, redireciona imediatamente para `/login`,
 * cortando qualquer renderização subsequente no servidor.
 *
 * @example
 * // Em src/app/journal/page.tsx
 * export default async function JournalPage() {
 *   await requireAuth();
 *   // ... renderiza o diário
 * }
 */
export const requireAuth = async (): Promise<void> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    redirect("/login");
  }
};

/**
 * Guard para rotas **públicas com exclusão de autenticados**.
 *
 * Deve ser chamado em páginas como Login e Cadastro para evitar que
 * usuários já autenticados as acessem novamente.
 *
 * Se o cookie de sessão existir, redireciona para `/` (home).
 *
 * @example
 * // Em src/app/login/page.tsx
 * export default async function LoginPage() {
 *   await requireGuest();
 *   // ... renderiza o formulário de login
 * }
 */
export const requireGuest = async (): Promise<void> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (sessionCookie?.value) {
    redirect("/");
  }
};

/**
 * Verifica se o usuário está autenticado sem realizar redirecionamentos.
 * Útil para renderização condicional de elementos de UI (ex: navbar).
 *
 * @returns `true` se autenticado, `false` caso contrário.
 *
 * @example
 * const authenticated = await isAuthenticated();
 * if (authenticated) { // mostra botão de logout }
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  return Boolean(sessionCookie?.value);
};
