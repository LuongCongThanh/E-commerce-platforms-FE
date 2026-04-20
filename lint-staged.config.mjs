export default {
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{js,mjs,cjs}': ['prettier --write'],
  '*.{json,md,mdx,css,scss,yaml,yml}': ['prettier --write'],
};
