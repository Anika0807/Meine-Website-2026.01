// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://anika-warncke.de',
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['react-cookie-consent', 'framer-motion'],
      exclude: ['aria-query'],
    },
    ssr: {
      noExternal: ['react-cookie-consent', 'framer-motion'],
    },
  },

  integrations: [react()],

  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: false, // / für Deutsch, /en/ für Englisch
    },
  },
});