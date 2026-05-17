import { createFileRoute, Link } from '@tanstack/react-router';
import { getMessage } from '~/lib/message';

// noinspection JSUnusedGlobalSymbols
export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
  // Deliberately no validateSearch: TanStack Router's search-param normalisation
  // would redirect /auth/login → /auth/login?error=null&callbackUrl=null and
  // back in an infinite loop when validateSearch returns null-valued keys.
  // Raw search params are read directly from the URL in the component instead.
});

function LoginPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const search = Route.useSearch() as Record<string, string | undefined>;
  const error = search.error;
  const callbackUrl = search.callbackUrl;
  const { message } = getMessage(error, 'signin-error');

  return (
    <main className="grid flex-1 place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-8 w-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
            />
          </svg>
        </div>
        <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          Sign in
        </h1>
        <p
          className={`mt-6 text-lg font-medium text-pretty sm:text-xl/8 ${
            error ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          {error ? message : 'Continue to your account'}
        </p>
        <div className="mt-10">
          <a
            href={`/api/auth/signin/zitadel${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z"
                clipRule="evenodd"
              />
            </svg>
            Sign in with Zitadel
          </a>
        </div>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
