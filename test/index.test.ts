import {
  describe,
  expect,
  it,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';

// Node.js's Response.redirect rejects relative URLs, so we mock it to
// capture the URL and return a proper 302 response for assertions.
beforeEach(() => {
  jest.spyOn(Response, 'redirect').mockImplementation(
    (url: string | URL, status?: number) =>
      new Response(null, {
        status: status ?? 302,
        headers: { location: String(url) },
      }),
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Package Exports', () => {
  describe('Main Entry Point', () => {
    it('should export TanStackAuth function', async () => {
      const { TanStackAuth } = await import('../src/index.js');

      expect(TanStackAuth).toBeDefined();
      expect(typeof TanStackAuth).toBe('function');
    });

    it('should export standalone getSession function', async () => {
      const { getSession } = await import('../src/index.js');

      expect(getSession).toBeDefined();
      expect(typeof getSession).toBe('function');
    });

    it('should export AuthError', async () => {
      const { AuthError } = await import('../src/index.js');

      expect(AuthError).toBeDefined();
    });

    it('should export CredentialsSignin', async () => {
      const { CredentialsSignin } = await import('../src/index.js');

      expect(CredentialsSignin).toBeDefined();
    });
  });

  describe('TanStackAuth() return shape', () => {
    it('should return handlers with GET and POST', async () => {
      const { TanStackAuth } = await import('../src/index.js');
      const result = TanStackAuth({ providers: [] });

      expect(result).toHaveProperty('handlers');
      expect(typeof result.handlers.GET).toBe('function');
      expect(typeof result.handlers.POST).toBe('function');
    });

    it('should return flat GET and POST (deprecated)', async () => {
      const { TanStackAuth } = await import('../src/index.js');
      const result = TanStackAuth({ providers: [] });

      expect(typeof result.GET).toBe('function');
      expect(typeof result.POST).toBe('function');
    });

    it('flat GET/POST should be the same reference as handlers.GET/POST', async () => {
      const { TanStackAuth } = await import('../src/index.js');
      const result = TanStackAuth({ providers: [] });

      expect(result.GET).toBe(result.handlers.GET);
      expect(result.POST).toBe(result.handlers.POST);
    });

    it('should return getSession function', async () => {
      const { TanStackAuth } = await import('../src/index.js');
      const result = TanStackAuth({ providers: [] });

      expect(typeof result.getSession).toBe('function');
    });

    it('should return auth as deprecated alias for getSession', async () => {
      const { TanStackAuth } = await import('../src/index.js');
      const result = TanStackAuth({ providers: [] });

      expect(typeof result.auth).toBe('function');
      expect(result.auth).toBe(result.getSession);
    });

    it('should return signIn and signOut functions', async () => {
      const { TanStackAuth } = await import('../src/index.js');
      const result = TanStackAuth({ providers: [] });

      expect(typeof result.signIn).toBe('function');
      expect(typeof result.signOut).toBe('function');
    });
  });

  describe('signIn URL construction', () => {
    it('should redirect to /api/auth/signin/{provider} with a provider', async () => {
      const { TanStackAuth } = await import('../src/index.js');
      const { signIn } = TanStackAuth({ providers: [] });

      const response = await signIn('zitadel');

      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toBe('/api/auth/signin/zitadel');
    });

    it('should redirect to /api/auth/signin when no provider given', async () => {
      const { TanStackAuth } = await import('../src/index.js');
      const { signIn } = TanStackAuth({ providers: [] });

      const response = await signIn();

      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toBe('/api/auth/signin');
    });

    it('should append callbackUrl when redirectTo is provided', async () => {
      const { TanStackAuth } = await import('../src/index.js');
      const { signIn } = TanStackAuth({ providers: [] });

      const response = await signIn('zitadel', { redirectTo: '/dashboard' });
      const location = response.headers.get('location') ?? '';

      expect(response.status).toBe(302);
      expect(location).toContain('/api/auth/signin/zitadel');
      expect(location).toContain('callbackUrl=');
      expect(location).toContain('%2Fdashboard');
    });

    it('should respect custom basePath', async () => {
      const { TanStackAuth } = await import('../src/index.js');
      const { signIn } = TanStackAuth({ providers: [], basePath: '/my-auth' });

      const response = await signIn('zitadel');

      expect(response.headers.get('location')).toBe('/my-auth/signin/zitadel');
    });

    it('should strip trailing slash from basePath', async () => {
      const { TanStackAuth } = await import('../src/index.js');
      const { signIn } = TanStackAuth({ providers: [], basePath: '/my-auth/' });

      const response = await signIn('zitadel');

      expect(response.headers.get('location')).toBe('/my-auth/signin/zitadel');
    });
  });

  describe('signOut URL construction', () => {
    it('should redirect to /api/auth/signout', async () => {
      const { TanStackAuth } = await import('../src/index.js');
      const { signOut } = TanStackAuth({ providers: [] });

      const response = await signOut();

      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toBe('/api/auth/signout');
    });

    it('should append callbackUrl when redirectTo is provided', async () => {
      const { TanStackAuth } = await import('../src/index.js');
      const { signOut } = TanStackAuth({ providers: [] });

      const response = await signOut({ redirectTo: '/' });
      const location = response.headers.get('location') ?? '';

      expect(response.status).toBe(302);
      expect(location).toContain('/api/auth/signout');
      expect(location).toContain('callbackUrl=');
    });

    it('should respect custom basePath', async () => {
      const { TanStackAuth } = await import('../src/index.js');
      const { signOut } = TanStackAuth({ providers: [], basePath: '/my-auth' });

      const response = await signOut();

      expect(response.headers.get('location')).toBe('/my-auth/signout');
    });
  });

  describe('Adapter Entry Point', () => {
    it('should be importable', async () => {
      const module = await import('../src/adapter.js');

      expect(module).toBeDefined();
    });
  });
});
