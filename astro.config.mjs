import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.sg-fussball.online',
  base: '/',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
