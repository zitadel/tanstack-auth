import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function createRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
  });
}

/**
 * Return a fresh router for every SSR request.
 *
 * Reusing a singleton router across requests causes TanStack Router's
 * `state.redirect` to leak from one request (e.g. /profile → /auth/login)
 * into the next (e.g. /auth/login → /auth/login redirect loop).  A new
 * instance is cheap and avoids all cross-request state contamination.
 *
 * On the client side TanStack Start replaces this with a stable singleton
 * via its own internal bootstrapping, so returning a new instance from here
 * is safe in both environments.
 */
export async function getRouter() {
  return createRouter();
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
