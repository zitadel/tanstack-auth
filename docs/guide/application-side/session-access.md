---
title: Session Access (client)
group: Application Side
---

# Client-side session access

TanStack Start's pattern: load the session in a route's `beforeLoad` or via
a server function, then consume it via the router context.

## In a route beforeLoad

```ts
// app/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getSession } from '~/auth.server';

const fetchSession = createServerFn().handler(async ({ context }) => {
  return getSession(context.request);
});

export const Route = createRootRoute({
  beforeLoad: async () => ({ session: await fetchSession() }),
  component: () => {
    const { session } = Route.useRouteContext();
    return (
      <>
        {session ? <UserBadge user={session.user} /> : <a href="/auth/login">Sign in</a>}
        <Outlet />
      </>
    );
  },
});
```

## signIn / signOut

```ts
import { signIn, signOut } from '@zitadel/tanstack-auth/client';

<button onClick={() => signIn('github')}>Sign in with GitHub</button>
<button onClick={() => signOut()}>Sign out</button>
```
