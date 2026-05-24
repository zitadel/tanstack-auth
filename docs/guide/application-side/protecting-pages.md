---
title: Protecting Pages
group: Application Side
---

# Protecting pages

TanStack Start gates routes via `beforeLoad`. Throw a `redirect` if the
session is absent and the route never proceeds to render.

## In a route

```ts
// app/routes/profile.tsx
import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getSession } from '~/auth.server';

const fetchSession = createServerFn().handler(async ({ context }) => {
  return getSession(context.request);
});

export const Route = createFileRoute('/profile')({
  beforeLoad: async ({ location }) => {
    const session = await fetchSession();
    if (!session) {
      throw redirect({
        to: '/auth/login',
        search: { callbackUrl: location.pathname },
      });
    }
    return { session };
  },
  component: ProfilePage,
});

function ProfilePage() {
  const { session } = Route.useRouteContext();
  return <h1>Hello, {session.user?.name}</h1>;
}
```

## Reusable layout gate

Apply the gate at a layout route so all children inherit it:

```ts
// app/routes/_protected.tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { fetchSession } from '~/lib/session';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async () => {
    const session = await fetchSession();
    if (!session) throw redirect({ to: '/auth/login' });
    return { session };
  },
  component: () => <Outlet />,
});
```
