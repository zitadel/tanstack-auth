import {
  Auth,
  type AuthConfig,
  setEnvDefaults,
  createActionURL,
} from '@auth/core';
import type { Session } from '@auth/core/types';

export { AuthError, CredentialsSignin } from '@auth/core/errors';
export type {
  Account,
  DefaultSession,
  Profile,
  Session,
  User,
} from '@auth/core/types';

/**
 * Auth.js configuration for TanStack Start applications.
 *
 * @public
 */
export type TanStackAuthConfig = Omit<AuthConfig, 'raw'>;

/**
 * TanStack Start API route handler context type.
 *
 * @public
 */
export type AuthRequestContext = {
  request: Request;
};

/**
 * Either a static {@link TanStackAuthConfig} object or a request-scoped
 * factory `(ctx) => TanStackAuthConfig`.
 *
 * The factory form defers config evaluation until request time, which keeps
 * server-only imports out of any code path the bundler can reach from a
 * client entry point. Useful when reading config from request-scoped env
 * (Cloudflare Workers, Deno Deploy) rather than from `process.env`.
 *
 * @public
 */
export type TanStackAuthConfigOrFactory =
  | TanStackAuthConfig
  | ((context: AuthRequestContext) => TanStackAuthConfig);

/**
 * Creates a TanStack Start Auth handler.
 *
 * Accepts either a {@link TanStackAuthConfig} object or a request-scoped
 * factory `(ctx) => TanStackAuthConfig`. The factory form defers config
 * evaluation to request time, which keeps server-only imports off any
 * client-reachable graph.
 *
 * Based on the `start-authjs` community package pattern used in the official
 * TanStack example.
 *
 * @param rawConfig - Auth.js configuration object or factory function
 * @returns Object containing handlers and getSession utility
 *
 * @example
 * ```ts
 * // app/auth.server.ts — object form
 * import { TanStackAuth } from '@zitadel/tanstack-auth';
 * import Zitadel from '@auth/core/providers/zitadel';
 *
 * export const { handlers, getSession } = TanStackAuth({
 *   providers: [Zitadel({ ... })],
 *   secret: process.env.AUTH_SECRET,
 * });
 * ```
 *
 * @example
 * ```ts
 * // app/auth.server.ts — factory form (request-scoped env)
 * import { TanStackAuth } from '@zitadel/tanstack-auth';
 *
 * export const { handlers, getSession } = TanStackAuth((ctx) => ({
 *   providers: [Zitadel({
 *     clientId: ctx.request.headers.get('x-zitadel-client-id') ?? '',
 *   })],
 *   secret: process.env.AUTH_SECRET,
 * }));
 * ```
 *
 * @example
 * ```ts
 * // app/routes/api/auth/$.ts
 * import { handlers } from '~/auth.server';
 * export const { GET, POST } = handlers;
 * ```
 *
 * @public
 */
export function TanStackAuth(rawConfig: TanStackAuthConfigOrFactory): {
  handlers: {
    GET: (context: AuthRequestContext) => Promise<Response>;
    POST: (context: AuthRequestContext) => Promise<Response>;
  };
  /** @deprecated Use `handlers.GET` instead */
  GET: (context: AuthRequestContext) => Promise<Response>;
  /** @deprecated Use `handlers.POST` instead */
  POST: (context: AuthRequestContext) => Promise<Response>;
  getSession: (request: Request) => Promise<Session | null>;
  /** @deprecated Use `getSession` instead */
  auth: (request: Request) => Promise<Session | null>;
  signIn: (
    provider?: string,
    options?: { redirectTo?: string },
  ) => Promise<Response>;
  signOut: (options?: { redirectTo?: string }) => Promise<Response>;
} {
  function resolveConfig(context: AuthRequestContext): TanStackAuthConfig {
    const c = typeof rawConfig === 'function' ? rawConfig(context) : rawConfig;
    c.basePath ??= '/api/auth';
    setEnvDefaults(process.env, c);
    return c;
  }

  function defaultBasePath(): string {
    if (typeof rawConfig === 'function') return '/api/auth';
    return (rawConfig.basePath ?? '/api/auth').replace(/\/$/, '');
  }

  async function handler(context: AuthRequestContext): Promise<Response> {
    const config = resolveConfig(context);
    return Auth(context.request, config);
  }

  async function getSession(request: Request): Promise<Session | null> {
    const config = resolveConfig({ request });
    const url = createActionURL(
      'session',
      new URL(request.url).protocol.slice(0, -1) as 'http' | 'https',
      new Headers(request.headers),
      process.env,
      config,
    );

    const response = await Auth(
      new Request(url, {
        headers: { cookie: request.headers.get('cookie') ?? '' },
      }),
      config,
    );

    const { status } = response;
    const data = (await response.json()) as Record<string, unknown> | null;
    if (!data || !Object.keys(data).length) return null;
    if (status === 200) return data as unknown as Session;
    throw new Error((data as { message?: string }).message ?? 'Session error');
  }

  async function signIn(
    provider?: string,
    options: { redirectTo?: string } = {},
  ): Promise<Response> {
    const basePath = defaultBasePath();
    const params = new URLSearchParams();
    if (options.redirectTo) params.set('callbackUrl', options.redirectTo);
    const paramStr = params.toString();
    const url = provider
      ? `${basePath}/signin/${provider}${paramStr ? `?${paramStr}` : ''}`
      : `${basePath}/signin${paramStr ? `?${paramStr}` : ''}`;
    return Response.redirect(url, 302);
  }

  async function signOut(
    options: { redirectTo?: string } = {},
  ): Promise<Response> {
    const basePath = defaultBasePath();
    const params = new URLSearchParams();
    if (options.redirectTo) params.set('callbackUrl', options.redirectTo);
    const paramStr = params.toString();
    const url = `${basePath}/signout${paramStr ? `?${paramStr}` : ''}`;
    return Response.redirect(url, 302);
  }

  return {
    handlers: { GET: handler, POST: handler },
    GET: handler,
    POST: handler,
    getSession,
    auth: getSession,
    signIn,
    signOut,
  };
}

/**
 * Retrieves the current session on the server side.
 *
 * Standalone two-argument form — use this when you don't have a factory
 * instance but have a request and config available directly.
 *
 * @param req - The current Request object
 * @param config - Auth.js configuration
 * @returns The session object or null
 *
 * @example
 * ```ts
 * import { getSession } from '@zitadel/tanstack-auth';
 * import { authOptions } from '~/auth.server';
 *
 * const session = await getSession(request, authOptions);
 * ```
 *
 * @public
 */
export async function getSession(
  req: Request,
  config: TanStackAuthConfig,
): Promise<Session | null> {
  config.basePath ??= '/api/auth';
  setEnvDefaults(process.env, config);

  const url = createActionURL(
    'session',
    new URL(req.url).protocol.slice(0, -1) as 'http' | 'https',
    new Headers(req.headers),
    process.env,
    config,
  );

  const response = await Auth(
    new Request(url, { headers: { cookie: req.headers.get('cookie') ?? '' } }),
    config,
  );

  const { status } = response;
  const data = (await response.json()) as Record<string, unknown> | null;
  if (!data || !Object.keys(data).length) return null;
  if (status === 200) return data as unknown as Session;
  throw new Error((data as { message?: string }).message ?? 'Session error');
}
