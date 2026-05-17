# TanStack Start with ZITADEL

[TanStack Start](https://tanstack.com/start) is a full-stack web framework built on TanStack Router and Vinxi that enables you to create type-safe, performant web applications with a modern development experience. TanStack Start provides server-side rendering, file-based routing, and seamless server functions for a great developer and user experience.

To secure such an application, you need a reliable way to handle user logins. For the TanStack Start ecosystem, [Auth.js for TanStack Start](https://authjs.dev/) is the recommended library for authentication. Think of it as a flexible security guard for your app. This guide demonstrates how to use Auth.js with a TanStack Start application to implement a secure login with ZITADEL.

We'll be using the **OpenID Connect (OIDC)** protocol with the **Authorization Code Flow + PKCE**. This is the industry-best practice for security, ensuring that the login process is safe from start to finish. You can learn more in our [guide to OAuth 2.0 recommended flows](https://zitadel.com/docs/guides/integrate/login/oidc/oauth-recommended-flows).

This example uses **Auth.js for TanStack Start**, the standard for TanStack Start authentication. While ZITADEL doesn't offer a specific SDK, Auth.js is highly modular. It works with a "provider" that handles the communication with ZITADEL. Under the hood, this example uses the powerful OIDC standard to manage the secure PKCE flow.

Check out our Example Application to see it in action.

## Example Application

The example repository includes a complete TanStack Start application, ready to run, that demonstrates how to integrate ZITADEL for user authentication.

This example application showcases a typical web app authentication pattern: users start on a public landing page, click a login button to authenticate with ZITADEL, and are then redirected to a protected profile page displaying their user information. The app also includes secure logout functionality that clears the session and redirects users back to ZITADEL's logout endpoint. All protected routes are automatically secured using Auth.js middleware and session management, ensuring only authenticated users can access sensitive areas of your application.

### Prerequisites

Before you begin, ensure you have the following:

#### System Requirements

- Node.js (v20 or later is recommended)
- npm, yarn, or pnpm package manager

#### Account Setup

You'll need a ZITADEL account and application configured. Follow the [ZITADEL documentation on creating applications](https://zitadel.com/docs/guides/integrate/login/oidc/web-app) to set up your account and create a Web application with Authorization Code + PKCE flow.

> **Important:** Configure the following URLs in your ZITADEL application settings:
>
> - **Redirect URIs:** Add `http://localhost:3000/api/auth/callback/zitadel` (for development)
> - **Post Logout Redirect URIs:** Add `http://localhost:3000/api/auth/logout/callback` (for development)
>
> These URLs must exactly match what your TanStack Start application uses. For production, add your production URLs.

### Configuration

To run the application, you first need to copy the `.env.example` file to a new file named `.env` and fill in your ZITADEL application credentials.

```dotenv
# Port number where your TanStack Start server will listen for incoming HTTP requests.
# Change this if port 3000 is already in use on your system.
PORT=3000

# Session timeout in seconds. Users will be automatically logged out after this
# duration of inactivity. 3600 seconds = 1 hour.
SESSION_DURATION=3600

# Secret key used to cryptographically sign session cookies to prevent
# tampering. MUST be a long, random string. Generate a secure key using:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET="your-very-secret-and-strong-session-key"

# Your ZITADEL instance domain URL. Found in your ZITADEL console under
# instance settings. Include the full https:// URL.
# Example: https://my-org-a1b2c3.zitadel.cloud
ZITADEL_DOMAIN="https://your-zitadel-domain"

# Application Client ID from your ZITADEL application settings. This unique
# identifier tells ZITADEL which application is making the authentication
# request.
ZITADEL_CLIENT_ID="your-client-id"

# While the Authorization Code Flow with PKCE for public clients
# does not strictly require a client secret for OIDC specification compliance,
# Auth.js will still require a value for its internal configuration.
# Therefore, please provide a randomly generated string here.
# You can generate a secure key using:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ZITADEL_CLIENT_SECRET="your-randomly-generated-client-secret"

# OAuth callback URL where ZITADEL redirects after user authentication. This
# MUST exactly match a Redirect URI configured in your ZITADEL application.
ZITADEL_CALLBACK_URL="http://localhost:3000/api/auth/callback/zitadel"

# URL where users are redirected after logout. This should match a Post Logout
# Redirect URI configured in your ZITADEL application settings.
ZITADEL_POST_LOGOUT_URL="http://localhost:3000/api/auth/logout/callback"

# Optional. URL where users are redirected after successful login.
# Defaults to "/profile" if not specified.
ZITADEL_POST_LOGIN_URL="/profile"

```

### Installation and Running

Follow these steps to get the application running:

```bash
# 1. Clone the repository
git clone git@github.com:zitadel/example-auth-tanstack-start.git

cd example-auth-tanstack-start

# 2. Install the project dependencies
npm install

# 3. Start the development server
npm start
# or
make start
```

The application will now be running at `http://localhost:3000`.

## Key Features

### PKCE Authentication Flow

The application implements the secure Authorization Code Flow with PKCE (Proof Key for Code Exchange), which is the recommended approach for modern web applications.

### Session Management

Built-in session management with Auth.js handles user authentication state across your application, with automatic token refresh and secure session storage.

### Route Protection

Protected routes automatically redirect unauthenticated users to the login flow, ensuring sensitive areas of your application remain secure.

### Logout Flow

Complete logout implementation that properly terminates both the local session and the ZITADEL session, with proper redirect handling.

## TODOs

### 1. Security headers (TanStack Start built-in)

**Partially enabled.** TanStack Start includes some security headers by default, but consider adding custom headers in `app.config.ts`:

```typescript
import { defineConfig } from '@tanstack/react-start/config';

export default defineConfig({
  server: {
    headers: {
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
});
```

At minimum, configure:

- `Content-Security-Policy` (CSP)
- `X-Frame-Options` / `frame-ancestors`
- `Referrer-Policy`
- `Permissions-Policy`

## Resources

- **TanStack Start Documentation:** <https://tanstack.com/start/latest>
- **Auth.js Documentation:** <https://authjs.dev/>
- **ZITADEL Documentation:** <https://zitadel.com/docs>
