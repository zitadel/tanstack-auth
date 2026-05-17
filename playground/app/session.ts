import { createServerFn } from '@tanstack/react-start';
import { getStartContext } from '@tanstack/start-storage-context';
import type { Session } from '@auth/core/types';

/**
 * Server function that loads the current session from the Auth.js JWT cookie.
 *
 * Using `createServerFn` ensures that the `auth.server` module (which uses
 * Node.js crypto APIs) is only bundled for the server. Without this wrapper,
 * importing `auth.server` at the top level of a route file would trigger
 * TanStack Start's import-protection for `*.server.*` files, crashing the
 * client-side router during hydration.
 */
export const fetchSession = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Session | null> => {
    // Capture the ALS context before any async operation (dynamic import) to
    // prevent it from being lost if the ALS chain breaks across an await.
    const ctx = getStartContext({ throwIfNotFound: false });
    if (!ctx) return null;
    const { getSession } = await import('./auth.server');
    return getSession(ctx.request);
  },
);
