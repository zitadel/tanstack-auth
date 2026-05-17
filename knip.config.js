module.exports = {
  ignore: [
    'commitlint.config.js',
    'dist/**',
    'build/**',
    'typedoc.config.mjs',
    'playground/**',
  ],
  ignoreDependencies: [
    '@commitlint/config-conventional',
    '@semantic-release/.*?',
    '@jest/globals',
    '@types/react',
    'jest-environment-jsdom',
  ],
};
