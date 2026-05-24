---
title: Quick Start
group: Auth.js Provider
children:
  - ./tanstack-auth-handler.md
  - ./session-data.md
  - ./custom-pages.md
  - ./server-side/session-access.md
  - ./server-side/rest-api.md
---

# Auth.js Quick Start

This guide walks through setting up `@zitadel/tanstack-auth` with the
Auth.js provider, suitable for OAuth, magic links, and credentials sign-in.

## Installation

Install `@auth/core` alongside `@zitadel/tanstack-auth`:

```bash
npm install @zitadel/tanstack-auth @auth/core
```

## Configure TanStackAuth

Create `app/auth.server.ts` and call the `TanStackAuth()` factory:

```ts
// app/auth.server.ts
import { TanStackAuth } from '@zitadel/tanstack-auth';
import GitHub from '@auth/core/providers/github';

export const { handlers, getSession, signIn, signInUrl, signOut, signOutUrl } =
  TanStackAuth({
    secret: process.env.AUTH_SECRET,
    providers: [
      GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
    ],
  });
```

## Mount the catch-all route

Create the TanStack Start API route:

```ts
// app/routes/api/auth/$.ts
import { createServerFileRoute } from '@tanstack/react-start/server';
import { handlers } from '~/auth.server';

export const ServerRoute = createServerFileRoute().methods({
  GET: handlers.GET,
  POST: handlers.POST,
});
```

All Auth.js endpoints are now served under `/api/auth/*`.

## Set the secret

The `secret` is used to sign + encrypt session JWTs. In production this MUST
be set:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Set it as `AUTH_SECRET` in your environment.

## Next Steps

- [Customize session data](./session-data.md)
- [Override the default auth pages](./custom-pages.md)
- [Access the session server-side](./server-side/session-access.md)
