---
title: TanStackAuth Factory
group: OAuth Provider
---

# TanStackAuth Factory

The `TanStackAuth()` factory wires up the auth handler and returns
helpers bound to your config. Call it once in `app/auth.server.ts`:

```ts
import { TanStackAuth } from '@zitadel/tanstack-auth';

export const {
  handlers,     // { GET, POST } for the catch-all route
  GET, POST,    // top-level aliases
  getSession,   // server-side session reader
  signIn, signInUrl, signOut, signOutUrl,
  auth,         // deprecated alias for getSession
} = TanStackAuth({
  secret: process.env.AUTH_SECRET,
  providers: [/* ... */],
});
```

## Return values

| Key | Type | Use |
|---|---|---|
| `handlers` | `{ GET, POST }` | Mount in the catch-all API route |
| `getSession` | `(request: Request) => Promise<Session \| null>` | Read the session in routes/server fns |
| `signIn`, `signInUrl`, `signOut`, `signOutUrl` | helpers | Compute or perform the redirect |

## Mounting the handlers

```ts
// app/routes/api/auth/$.ts
import { createServerFileRoute } from '@tanstack/react-start/server';
import { handlers } from '~/auth.server';

export const ServerRoute = createServerFileRoute().methods({
  GET: handlers.GET,
  POST: handlers.POST,
});
```

## Server-side reads

See [Server-side session access](./server-side/session-access.md).
