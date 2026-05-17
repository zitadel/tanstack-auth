import { createAPIFileRoute } from '@tanstack/react-start/api';

/** Public endpoint — accessible without authentication. */
export const APIRoute = createAPIFileRoute('/api/unprotected')({
  GET: async () => {
    return Response.json({ ok: true });
  },
});
