export default {
  '*.{ts,tsx}': ['prettier --write', 'eslint --fix'],
  '*.{js,mjs,cjs}': ['prettier --write'],
  '*.{json,md,mdx,css,scss,yaml,yml}': ['prettier --write'],
};
