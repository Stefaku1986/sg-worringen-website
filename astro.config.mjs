import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://Stefaku1986.github.io',
  base: '/sg-worringen-website',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
