module.exports = {
  ignore: ['commitlint.config.js', 'dist/**', 'build/**'],
  ignoreDependencies: [
    '@commitlint/config-conventional',
    '@semantic-release/.*?',
    '@jest/globals',
    '@types/react',
  ],
};
