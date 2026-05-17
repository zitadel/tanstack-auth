import { createAPIFileRoute } from '@tanstack/react-start/api';
import { getSession } from '~/auth.server';

/** Protected endpoint — returns 403 when the request is unauthenticated. */
export const APIRoute = createAPIFileRoute('/api/secured')({
  GET: async ({ request }: { request: Request }) => {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    return Response.json({ ok: true });
  },
});
