import type { FC } from 'react';
import { signOut } from '@zitadel/tanstack-auth/client';

// noinspection JSUnusedGlobalSymbols
export const SignOutButton: FC = () => (
  <button
    type="button"
    onClick={() => void signOut({ callbackUrl: '/' })}
    data-testid="signout-button"
    className="cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-red-600"
  >
    Sign out
  </button>
);
