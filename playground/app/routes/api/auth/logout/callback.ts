import { createAPIFileRoute } from '@tanstack/react-start/api';

// noinspection JSUnusedGlobalSymbols
/**
 * Handles the logout callback by clearing all Auth.js session cookies and
 * redirecting to the success page. Used by Playwright tests to verify cookie
 * clearing. State validation is omitted in the playground.
 */
export const APIRoute = createAPIFileRoute('/api/auth/logout/callback')({
  GET: async ({ request }: { request: Request }) => {
    const cookieHeader = request.headers.get('Cookie') ?? '';
    const cookieNames = cookieHeader
      .split(';')
      .filter(Boolean)
      .map((c: string) => c.trim().split('=')[0].trim())
      .filter((name: string) => name.startsWith('authjs.'));

    const headers = new Headers({ Location: '/' });
    for (const name of cookieNames) {
      headers.append('Set-Cookie', `${name}=; Max-Age=0; Path=/`);
    }
    return new Response(null, { status: 302, headers });
  },
});
