import mridang from '@mridang/eslint-defaults';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '.out/**',
      '.npm/**',
      'docs/**',
      'playground/**',
    ],
  },
  ...mridang.configs.recommended,
];
