module.exports = {
  ignore: ['commitlint.config.js', 'playground/**'],
  ignoreDependencies: [
    '@commitlint/config-conventional',
    '@semantic-release/.*?',
    '@types/react',
    'jest-environment-jsdom',
  ],
};
