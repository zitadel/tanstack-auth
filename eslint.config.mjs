import mridang from '@mridang/eslint-defaults';

export default [
  {
    ignores: ['README.md', 'README.md/**', 'docs/**'],
  },
  ...mridang.configs.recommended,
];
