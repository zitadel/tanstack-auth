// noinspection JSUnusedGlobalSymbols
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server';
import { createServerEntry } from '@tanstack/react-start/server-entry';
import { handlers, getSession } from './auth.server';

const tanstackHandler = createStartHandler(defaultStreamHandler);

/**
 * Vite's CORS middleware calls res.setHeader('Vary', 'Origin') before srvx's
 * sendNodeResponse calls res.writeHead(). When writeHead receives a flat
 * ['set-cookie', v1, 'set-cookie', v2] array while the response already has a
 * setHeader entry, Node.js header-merge mode keeps only the last value for
 * each duplicate key — earlier Set-Cookie headers are silently dropped.
 *
 * Fix: move every Set-Cookie value onto the underlying Node.js ServerResponse
 * via setHeader() (which supports string[] and preserves all cookies), then
 * return a stripped Web Response so writeHead never sees 'set-cookie' and
 * cannot overwrite what we already set.
 */
function withCookiesFixed(request: Request, response: Response): Response {
  const cookies = response.headers.getSetCookie();
  if (cookies.length === 0) return response;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodeRes = (request as any)?.runtime?.node?.res as
    | { setHeader(name: string, value: string[]): void }
    | undefined;

  if (!nodeRes || typeof nodeRes.setHeader !== 'function') return response;

  nodeRes.setHeader('Set-Cookie', cookies);

  const strippedHeaders = new Headers();
  for (const [key, value] of response.headers) {
    if (key.toLowerCase() !== 'set-cookie') strippedHeaders.append(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: strippedHeaders,
  });
}

/**
 * Intercepts Auth.js API routes before TanStack Start's page router handles
 * them. Without this, TanStack Start would render its own 404 page for all
 * /api/auth/* paths since they are not declared as file-based page routes.
 */
async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;

  // POST /api/auth/logout → stub 405 (back-channel logout not implemented)
  if (pathname === '/api/auth/logout') {
    return new Response(null, { status: 405 });
  }

  // GET /api/auth/logout/callback → clear authjs.* cookies, redirect to /
  if (pathname === '/api/auth/logout/callback') {
    const cookieHeader = request.headers.get('Cookie') ?? '';
    const cookieNames = cookieHeader
      .split(';')
      .filter(Boolean)
      .map((c: string) => c.trim().split('=')[0].trim())
      .filter((name: string) => name.startsWith('authjs.'));

    const responseHeaders = new Headers({ Location: '/' });
    for (const name of cookieNames) {
      responseHeaders.append('Set-Cookie', `${name}=; Max-Age=0; Path=/`);
    }
    return withCookiesFixed(
      request,
      new Response(null, { status: 302, headers: responseHeaders }),
    );
  }

  // All other /api/auth/* routes → Auth.js
  if (pathname.startsWith('/api/auth/')) {
    if (request.method === 'GET')
      return withCookiesFixed(request, await handlers.GET({ request }));
    if (request.method === 'POST')
      return withCookiesFixed(request, await handlers.POST({ request }));
  }

  // Public API endpoint — no authentication required.
  if (pathname === '/api/unprotected') {
    return Response.json({ ok: true });
  }

  // Session-protected API endpoints — return 403 when unauthenticated.
  if (
    pathname === '/api/secured' ||
    pathname === '/api/protected/middleware'
  ) {
    const session = await getSession(request);
    if (!session) return Response.json({ error: 'Forbidden' }, { status: 403 });
    return Response.json({ ok: true });
  }

  // Everything else → TanStack Start SSR router
  return tanstackHandler(request);
}

export default createServerEntry({
  fetch: handleRequest,
});
