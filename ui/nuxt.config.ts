import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { defineNuxtConfig } from 'nuxt/config';

const faviconHash = createHash('sha256')
  .update(readFileSync(new URL('./public/favicon.ico', import.meta.url)))
  .digest('hex')
  .slice(0, 12);

const appleIconHash = createHash('sha256')
  .update(readFileSync(new URL('./public/images/favicon.png', import.meta.url)))
  .digest('hex')
  .slice(0, 12);

let extraNitro = {};
try {
  const API_URL = process.env.NUXT_API_URL;
  if (API_URL) {
    extraNitro = {
      devProxy: {
        '/api/': {
          target: API_URL,
          changeOrigin: true,
          // Development only. The backend answers 403 "Origin is not allowed." to any
          // request whose Origin does not match the Host it sees (app/features/auth/
          // middleware.py). changeOrigin rewrites the Host to localhost:8081, but the
          // Origin stays the client's: localhost:8082 on the PC (passes) and
          // 192.168.x.x:8082 on the phone (rejected). These two headers normalise the
          // proxy hop for any LAN client.
          // Not needed in production: the backend serves the frontend, so everything is same-origin.
          headers: {
            Origin: new URL(API_URL).origin,
            'Sec-Fetch-Site': 'same-origin',
          },
        },
      },
    };
  }
} catch {}

const isProd = 'production' === process.env.NODE_ENV;
const baseURL = isProd ? '/_base_path/' : '/';
export default defineNuxtConfig({
  ssr: false,
  sourcemap: false === isProd,
  devtools: { enabled: true },
  devServer: {
    port: 8082,
    host: '0.0.0.0',
  },
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
  },
  css: ['~/assets/css/tailwind.css'],
  runtimeConfig: {
    public: {
      APP_ENV: process.env.NODE_ENV,
      wss: process.env.NUXT_PUBLIC_WSS ?? '',
    },
  },
  app: {
    baseURL,
    buildAssetsDir: 'assets',
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#F5F0E6' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#2B2624' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Fetch Media' },
      ],
      base: { href: '/' },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: `favicon.ico?v=${faviconHash}` },
        { rel: 'manifest', href: 'manifest.webmanifest?v=100' },
        {
          rel: 'apple-touch-icon',
          sizes: '1024x1024',
          href: `apple-touch-icon.${appleIconHash}.png`,
        },
        { rel: 'apple-touch-startup-image', href: 'images/logo.png' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  modules: ['./modules/icon-catalog', '@nuxt/ui', '@vueuse/nuxt', '@nuxt/eslint', '@nuxtjs/i18n'],

  // Project fonts (IDEA.md): serif headings, Noto Sans body.
  // @nuxt/fonts downloads them at build/dev time and self-hosts them (the deploy does not depend on Google).
  fonts: {
    families: [
      { name: 'Noto Sans', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Fraunces', provider: 'google', weights: [500, 600, 700] },
    ],
  },

  i18n: {
    compilation: {
      strictMessage: false,
    },
    strategy: 'no_prefix',
    defaultLocale: 'en',
    langDir: 'locales',

    locales: [
      {
        code: 'en',
        name: 'English',
        language: 'en',
        file: 'en.json',
        dir: 'ltr',
      },
      {
        code: 'es',
        name: 'Español',
        language: 'es',
        file: 'es.json',
        dir: 'ltr',
      },
      {
        code: 'ar',
        name: 'العربية',
        language: 'ar',
        file: 'ar.json',
        dir: 'rtl',
      },
      {
        code: 'fr',
        name: 'Français',
        language: 'fr',
        file: 'fr.json',
        dir: 'ltr',
      },
      {
        code: 'zh',
        name: '中文',
        language: 'zh',
        file: 'zh.json',
        dir: 'ltr',
      },
      {
        code: 'ja',
        name: '日本語',
        language: 'ja',
        file: 'ja.json',
        dir: 'ltr',
      },
    ],

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'ytptube_locale',
      redirectOn: 'root',
      fallbackLocale: 'en',
    },
  },
  icon: {
    provider: 'none',
    fallbackToApi: false,
    clientBundle: {
      scan: {
        globInclude: ['app/**/*.{vue,ts,js}', 'node_modules/@nuxt/ui/dist/shared/ui*.mjs'],
        globExclude: [
          'dist',
          'build',
          'coverage',
          'test',
          'tests',
          '.*',
          'app/utils/generatedIconCatalog.ts',
        ],
      },
    },
  },
  // The old simple mode URL keeps working.
  routeRules: {
    '/simple': { redirect: '/' },
  },
  nitro: {
    sourceMap: false === isProd,
    output: {
      publicDir: isProd ? __dirname + '/exported' : __dirname + '/dist',
    },
    ...extraNitro,
  },
  vite: {
    optimizeDeps: {
      include: [
        '@microsoft/fetch-event-source',
        '@xterm/addon-fit',
        '@xterm/xterm',
        'cron-parser',
        'marked',
        'marked-base-url',
        'marked-alert',
        'marked-gfm-heading-id',
        'hls.js',
        'assjs',
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ],
    },
    server: {
      allowedHosts: true,
    },
    build: {
      chunkSizeWarningLimit: 550,
      rollupOptions: {
        onwarn(warning, warn) {
          if ('SOURCEMAP_BROKEN' === warning.code || 'PLUGIN_TIMINGS' === warning.code) {
            return;
          }

          warn(warning);
        },
      },
    },
  },
  telemetry: false,
  compatibilityDate: '2025-08-03',
  experimental: {
    checkOutdatedBuildInterval: 1000 * 60 * 60,
    payloadExtraction: 'client',
    defaults: {
      nuxtLink: {
        prefetchOn: {
          interaction: true,
          visibility: false,
        },
      },
    },
  },
  typescript: {
    typeCheck: true,
  },
});
