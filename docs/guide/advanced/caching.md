---
title: Caching
group: Advanced
children:
  - ./url-resolutions.md
  - ./deployment/self-hosted.md
  - ./deployment/vercel.md
  - ./deployment/netlify.md
---

# Caching content

Hosting providers often offer caching at the edge. Most sites see big
speed wins (and cost savings) by taking advantage of it — no cold
start, no request processing, no JavaScript parsing, just HTML served
straight from a CDN.

By default the user's session is read in a route loader or server
function and rendered into the HTML. That's fine for personalised
pages, but it's a footgun the moment those pages are cached: a cached
response containing user A's session will be served to user B.

To add caching in TanStack Start, return a `Cache-Control` header from
a server function or middleware. See the
[TanStack Start server functions docs](https://tanstack.com/start/latest/docs/framework/react/server-functions).

:::warning
If you cache a route, that route's loader MUST NOT call `getSession()`
or return session data. Otherwise the first user's session leaks into
the cached HTML served to everyone else.
:::

## Page specific cache rules

For a single cached route, set `Cache-Control` from a server function
and avoid touching the session in the loader. Read the session on the
client instead.

```ts
// app/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getWebRequest, setHeader } from '@tanstack/react-start/server';

const getPosts = createServerFn().handler(async () => {
  setHeader('cache-control', 'public, max-age=86400, s-maxage=86400');
  // Do not call getSession() here. Read session client-side via the
  // useSession() hook if you need it.
  return await fetchPosts();
});

export const Route = createFileRoute('/')({
  loader: () => getPosts(),
  component: Home,
});
```

## Global cache rules

To cache most pages by default, set `Cache-Control` from request
middleware and only override it on routes (like `/profile`) that must
stay dynamic.

```ts
// app/middleware/cache.ts
import { createMiddleware } from '@tanstack/react-start';
import { setHeader } from '@tanstack/react-start/server';

export const cacheMiddleware = createMiddleware().server(async ({ next }) => {
  setHeader('cache-control', 'public, max-age=86400, s-maxage=86400');
  return next();
});
```

## Combining rules

Headers set later in the request lifecycle (in a route's server
function) override headers set in middleware. So you can flip the
default per route.

For example: cache every page except `/profile`.

```ts
// Global middleware — cached
setHeader('cache-control', 'public, max-age=86400, s-maxage=86400');

// app/routes/profile.tsx — opt this route back into dynamic rendering
import { getSession } from '~/auth.server';

const getProfile = createServerFn().handler(async () => {
  setHeader('cache-control', 'private, no-store');
  return await getSession(getWebRequest());
});
```
