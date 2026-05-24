---
title: Installation
group: Getting Started
---

# Installation

Install `@zitadel/tanstack-auth` and `@auth/core`:

```bash
# npm
npm install @zitadel/tanstack-auth @auth/core

# pnpm
pnpm add @zitadel/tanstack-auth @auth/core

# yarn
yarn add @zitadel/tanstack-auth @auth/core
```

Mount the catch-all auth route at `app/routes/api/auth/$.ts`:

```ts
// app/routes/api/auth/$.ts
import { handlers } from '~/auth.server';

export const ServerRoute = createServerFileRoute().methods({
  GET: handlers.GET,
  POST: handlers.POST,
});
```
