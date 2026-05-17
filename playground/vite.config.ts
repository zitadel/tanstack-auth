import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';

// Load .env into process.env so server-side code using process.env works in dev
try { process.loadEnvFile?.('.env'); } catch { /* .env may not exist */ }
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  plugins: [
    tanstackStart({
      srcDirectory: 'app',
    }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '~': resolve(import.meta.dirname, './app'),
    },
  },
  server: {
    port: 3000,
    headers: {
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
});
