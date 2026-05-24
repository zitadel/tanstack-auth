---
title: Session Access
group: Auth.js Provider
category: Server Side
---

# Server-side session access

Access the current session from any server context (server function, API
route, route beforeLoad) using the factory-bound `getSession`:

## In an API route

```ts
// app/routes/api/me.ts
import { createServerFileRoute } from '@tanstack/react-start/server';
import { getSession } from '~/auth.server';

export const ServerRoute = createServerFileRoute().methods({
  async GET({ request }) {
    const session = await getSession(request);
    if (!session) return new Response(JSON.stringify({ error: 'unauthorised' }), { status: 401 });
    return Response.json({ user: session.user });
  },
});
```

## In a server function

```ts
import { createServerFn } from '@tanstack/react-start';
import { getSession } from '~/auth.server';

export const getMe = createServerFn().handler(async ({ context }) => {
  const session = await getSession(context.request);
  if (!session) throw new Error('unauthorised');
  return session.user;
});
```

## Return shape

`getSession()` returns the `Session` object Auth.js builds in the `session`
callback, or `null` when no valid session exists. It throws when Auth.js
returns a non-200 (e.g. on signature/decode failure).
