import { TanStackAuth } from '@zitadel/tanstack-auth';
import Credentials from '@auth/core/providers/credentials';

export const { handlers, getSession, signIn, signOut } = TanStackAuth({
  providers: [
    ...(process.env.OAUTH_ISSUER_URL
      ? [
          {
            id: 'mock-oidc',
            name: 'Mock OIDC',
            type: 'oidc' as const,
            issuer: process.env.OAUTH_ISSUER_URL,
            clientId: process.env.OAUTH_CLIENT_ID ?? 'test-client',
            clientSecret: process.env.OAUTH_CLIENT_SECRET ?? 'test-secret',
          },
        ]
      : []),
    Credentials({
      credentials: {
        username: { label: 'Username' },
        password: { label: 'Password', type: 'password' },
      },
      authorize(credentials) {
        if (
          credentials?.username === 'jsmith' &&
          credentials?.password === 'hunter2'
        ) {
          return { id: '1', name: 'J Smith', email: 'jsmith@example.com' };
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET!,
  callbacks: {
    redirect({ url, baseUrl }) {
      try {
        // Resolve relative URLs (Auth.js passes them unresolved) against baseUrl
        const parsed = new URL(url, baseUrl);
        const base = new URL(baseUrl);
        // Block cross-origin redirects
        if (parsed.origin !== base.origin) {
          return `${baseUrl}/profile`;
        }
        // When no explicit callbackUrl is set (default = base URL /), send to profile
        if (parsed.pathname === '/' && !parsed.search) {
          return `${baseUrl}/profile`;
        }
        // Otherwise pass through (handles signout → logout callback path)
        return parsed.href;
      } catch {
        return `${baseUrl}/profile`;
      }
    },
  },
});
