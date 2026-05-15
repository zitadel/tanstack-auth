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
 */
export type TanStackAuthConfig = Omit<AuthConfig, 'raw'>;

/**
 * TanStack Start API route handler context type.
 */
export type AuthRequestContext = {
  request: Request;
};

/**
 * Creates a TanStack Start Auth handler.
 *
 * Based on the `start-authjs` community package pattern used in the official
 * TanStack example.
 *
 * @param config - Auth.js configuration
 * @returns Object containing handlers, getSession, and auth utilities
 *
 * @example
 * ```ts
 * // app/auth.server.ts
 * import { TanStackAuth } from '@zitadel/tanstack-start-auth';
 * import Zitadel from '@auth/core/providers/zitadel';
 *
 * export const { handlers, getSession, auth } = TanStackAuth({
 *   providers: [Zitadel({ ... })],
 *   secret: process.env.AUTH_SECRET,
 * });
 * export const { GET, POST } = handlers;
 * ```
 *
 * @example
 * ```ts
 * // app/routes/api/auth/$.ts
 * import { handlers } from '~/auth.server';
 * export const { GET, POST } = handlers;
 * ```
 */
export function TanStackAuth(config: TanStackAuthConfig): {
  handlers: {
    GET: (context: AuthRequestContext) => Promise<Response>;
    POST: (context: AuthRequestContext) => Promise<Response>;
  };
  getSession: (request: Request) => Promise<Session | null>;
  auth: (context: AuthRequestContext) => Promise<Session | null>;
} {
  setEnvDefaults(process.env, config);

  async function handler(context: AuthRequestContext): Promise<Response> {
    return Auth(context.request, config);
  }

  async function getSession(request: Request): Promise<Session | null> {
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
    const data = await response.json();
    if (!data || !Object.keys(data).length) return null;
    if (status === 200) return data as Session;
    throw new Error((data as { message?: string }).message ?? 'Session error');
  }

  async function auth(context: AuthRequestContext): Promise<Session | null> {
    return getSession(context.request);
  }

  return {
    handlers: { GET: handler, POST: handler },
    getSession,
    auth,
  };
}
