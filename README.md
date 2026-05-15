# TanStack Start Auth.js

A [TanStack Start](https://tanstack.com/router/latest/docs/framework/react/start/overview)
integration for [Auth.js](https://authjs.dev/) that provides seamless
authentication with multiple providers, session management, and TanStack
Start-native API route patterns.

This integration brings the power and flexibility of Auth.js to TanStack Start
applications with full TypeScript support, native Fetch API handling, and
idiomatic TanStack patterns for server functions and API routes.

### Why?

Modern web applications require robust, secure, and flexible authentication
systems. While Auth.js provides excellent authentication capabilities,
integrating it with TanStack Start applications requires careful consideration
of framework patterns, server-side rendering, and TypeScript integration.

However, a direct integration isn't always straightforward. Different types
of applications or deployment scenarios might warrant different approaches:

- **API Route Integration:** Auth.js operates at the HTTP level, while TanStack
  Start uses file-based API routes with handler context objects. A proper
  integration should bridge this gap by providing GET and POST handlers that
  plug directly into TanStack Start's routing system.
- **HTTP Request Handling:** TanStack Start API routes receive a context object
  with a `request` property. This integration wraps Auth.js core to accept these
  context shapes with zero manual request bridging.
- **Session and Request Lifecycle:** Proper session handling in TanStack Start
  requires utilities that work with server functions, giving routes access to
  authentication state without additional boilerplate.
- **Route Protection:** Many applications need fine-grained authorization
  beyond simple authentication. `getSession()` and `auth()` provide clean
  server-side primitives suitable for protecting server functions and routes.

This integration, `@zitadel/tanstack-auth`, aims to provide the flexibility to
handle such scenarios. It allows you to leverage the full Auth.js ecosystem
while maintaining TanStack Start best practices, ultimately leading to a more
effective and less burdensome authentication implementation.

## Installation

Install using NPM by using the following command:

```sh
npm install @zitadel/tanstack-auth @auth/core
```

## Usage

To use this integration, call `TanStackAuth()` with your Auth.js configuration
and export the resulting handlers from your catch-all auth API route.

First, create your auth server module:

```ts
// app/auth.server.ts
import { TanStackAuth } from '@zitadel/tanstack-auth';
import Zitadel from '@auth/core/providers/zitadel';

export const { handlers, getSession, auth } = TanStackAuth({
  providers: [
    Zitadel({
      clientId: process.env.ZITADEL_CLIENT_ID,
      clientSecret: process.env.ZITADEL_CLIENT_SECRET,
      issuer: process.env.ZITADEL_DOMAIN,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});

export const { GET, POST } = handlers;
```

Then wire up the API route:

```ts
// app/routes/api/auth/$.ts
export { GET, POST } from '~/auth.server';
```

#### Using the Authentication System

The integration provides several functions and hooks for handling
authentication:

**Server Utilities:**

- `TanStackAuth(config)`: Creates `{ handlers: { GET, POST }, getSession, auth }`
- `getSession(request)`: Retrieves the current session from a request
- `auth(context)`: Convenience wrapper — retrieves the session from a handler context

**Basic Usage in a Server Function:**

```ts
// app/routes/index.tsx
import { createServerFn } from '@tanstack/react-start';
import { getSession } from '~/auth.server';

const getUser = createServerFn({ method: 'GET' }).handler(async ({ request }) => {
  return getSession(request);
});

export default function Home() {
  const session = getUser();

  return (
    <main>
      {session ? (
        <>
          <p>Welcome, {session.user?.name}</p>
          <a href="/api/auth/signout">Sign out</a>
        </>
      ) : (
        <a href="/api/auth/signin">Sign in</a>
      )}
    </main>
  );
}
```

**Protecting a Route:**

```ts
// app/routes/profile.tsx
import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getSession } from '~/auth.server';

const requireAuth = createServerFn({ method: 'GET' }).handler(
  async ({ request }) => {
    const session = await getSession(request);
    if (!session) throw redirect({ to: '/api/auth/signin' });
    return session;
  },
);
```

##### Example: Advanced Configuration with Multiple Providers

This example shows how to use the integration with multiple Auth.js
providers and custom session configuration:

```ts
// app/auth.server.ts
import { TanStackAuth } from '@zitadel/tanstack-auth';
import Zitadel from '@auth/core/providers/zitadel';
import Google from '@auth/core/providers/google';

export const { handlers, getSession, auth } = TanStackAuth({
  providers: [
    Zitadel({
      clientId: process.env.ZITADEL_CLIENT_ID,
      clientSecret: process.env.ZITADEL_CLIENT_SECRET,
      issuer: process.env.ZITADEL_DOMAIN,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) (token as any).roles = (user as any).roles;
      return token;
    },
    async session({ session, token }) {
      (session.user as any).roles = (token as any).roles as
        | string[]
        | undefined;
      return session;
    },
  },
});

export const { GET, POST } = handlers;
```

## Known Issues

- **SSR Required:** This integration requires TanStack Start to be configured
  with a server adapter (Vinxi-based). Ensure your `app.config.ts` specifies a
  compatible deployment target.
- **Environment Configuration:** The integration relies on `AUTH_SECRET` and,
  in many hosting scenarios, `AUTH_TRUST_HOST`. Ensure these are correctly set
  in your environment for production.
- **Callback URLs:** OAuth providers must be configured with the correct
  callback URL: `[origin]/api/auth/callback/[provider]`.
- **Type Augmentation:** If you attach additional properties (e.g., roles) to
  the Auth.js user object, extend your app's types accordingly so consumers of
  `session.user` remain type-safe.
- **Redirect Semantics:** OAuth providers expect real browser navigations during
  sign-in. Use `redirect()` from `@tanstack/react-router` or navigate to the
  sign-in URL directly — avoid manual `fetch()` calls to provider endpoints
  unless you know you need credential/email flows.

## Useful links

- **[Auth.js](https://authjs.dev/):** The authentication library that this
  integration is built upon.
- **[TanStack Start](https://tanstack.com/router/latest/docs/framework/react/start/overview):**
  The framework this integration targets.
- **[Auth.js Providers](https://authjs.dev/getting-started/providers):**
  Complete list of supported authentication providers.

## Contributing

If you have suggestions for how this integration could be improved, or
want to report a bug, open an issue — we'd love all and any contributions.

## License

Apache-2.0
