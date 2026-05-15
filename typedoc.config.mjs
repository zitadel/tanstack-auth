/** @type {import('typedoc').TypeDocOptions} */
export default {
  entryPoints: ['src/index.ts', 'src/adapter.ts'],
  out: 'docs',
  tsconfig: './tsconfig.json',
  readme: 'none',
  excludeInternal: true,
  excludePrivate: true,
};
