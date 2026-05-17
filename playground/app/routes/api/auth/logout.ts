import { createAPIFileRoute } from '@tanstack/react-start/api';

// noinspection JSUnusedGlobalSymbols

/**
 * The application uses Auth.js's built-in /api/auth/signout for sign-out.
 * This endpoint exists only to satisfy the logout route structure and is not
 * called by the UI. Back-channel logout (OIDC RP-Initiated Logout) is not
 * implemented in the playground.
 */
export const APIRoute = createAPIFileRoute('/api/auth/logout')({
  POST: async () => {
    return new Response(null, { status: 405 });
  },
});
