import mridang from '@mridang/eslint-defaults';

export default [
  {
    ignores: [
      'README.md',
      'README.md/**',
      'docs/**',
      '.vscode/**',
      '.claude/**',
      'dist/**',
      'build/**',
      '.out/**',
      'playground/**',
    ],
  },
  ...mridang.configs.recommended,
];
