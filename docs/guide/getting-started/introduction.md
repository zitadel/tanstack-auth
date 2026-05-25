---
title: Introduction
group: Getting Started
children:
  - ./installation.md
---

# Introduction

`@zitadel/tanstack-auth` is an open source library that provides
authentication for TanStack Start applications. It wraps
auth (`@auth/core`) to bring OAuth, credentials, and
magic-link authentication to TanStack Start with a native developer
experience.

Through a direct integration into TanStack Start's server functions and API
routes, you can access and utilize user sessions within your routes and
components directly.

## Features

### Authentication providers

- OAuth (eg. GitHub, Google, Twitter, Azure...)
- Custom OAuth (Add your own!)
- Credentials (username / email + password)
- Email Magic URLs

### Application Side Session Management

- Session fetching via `getSession` from server functions
- Methods to `getSession`, `signIn` and `signOut`
- Full TypeScript support for all methods and properties

### Application protection

- Server function gating with session checks
- Route `beforeLoad` patterns using session data
- API route protection via `getSession`
