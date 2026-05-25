---
title: Custom Pages
group: OAuth Provider
---

# Custom auth pages

Point `pages.signIn` and `pages.error` at your custom routes:

## Config

```ts
// app/auth.server.ts
TanStackAuth({
  pages: { signIn: '/auth/login', error: '/auth/error' },
})
```

## Custom sign-in page

```tsx
// app/routes/auth/login.tsx
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/auth/login')({ component: LoginPage });

function LoginPage() {
  const [csrfToken, setCsrfToken] = useState('');
  useEffect(() => {
    fetch('/api/auth/csrf').then((r) => r.json()).then((d) => setCsrfToken(d.csrfToken));
  }, []);
  return (
    <form action="/api/auth/signin/github" method="post">
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <button type="submit">Sign in with GitHub</button>
    </form>
  );
}
```

## Custom error page

```tsx
// app/routes/auth/error.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/error')({
  component: () => {
    const { error = 'default' } = Route.useSearch();
    return <main><h1>Sign-in error</h1><p>Code: {error}</p></main>;
  },
});
```
