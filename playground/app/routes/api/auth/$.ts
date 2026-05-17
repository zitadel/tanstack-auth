// noinspection JSUnusedGlobalSymbols
import { handlers } from '~/auth.server';
import { createAPIFileRoute } from '@tanstack/react-start/api';

export const APIRoute = createAPIFileRoute('/api/auth/$')({
  GET: ({ request }) => handlers.GET({ request }),
  POST: ({ request }) => handlers.POST({ request }),
});
