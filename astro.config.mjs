// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

import markdoc from '@astrojs/markdoc';

import cloudflare from '@astrojs/cloudflare';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://key-astro.pages.dev',
  trailingSlash: 'never',

  integrations: [react(), keystatic(), markdoc(), sitemap()],

  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@keystatic/core', '@keystatic/astro'],
      resolve: {
        conditions: ['workerd', 'worker', 'node'],
      },
    },
  },
});