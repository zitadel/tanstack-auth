import { createAPIFileRoute } from '@tanstack/react-start/api';
import { getSession } from '~/auth.server';

// noinspection JSUnusedGlobalSymbols
export const APIRoute = createAPIFileRoute('/api/userinfo')({
  GET: async ({ request }): Promise<Response> => {
    const session = await getSession(request);

    if (!session?.accessToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    try {
      const response = await fetch(
        `${process.env.ZITADEL_DOMAIN}/oidc/v1/userinfo`,
        { headers: { Authorization: `Bearer ${session.accessToken}` } },
      );
      if (!response.ok) {
        throw new Error(`UserInfo API error: ${response.status}`);
      }
      const userInfo = await response.json();
      return new Response(JSON.stringify(userInfo));
    } catch (error) {
      console.error('UserInfo fetch failed:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user info' }),
        { status: 500 },
      );
    }
  },
});
