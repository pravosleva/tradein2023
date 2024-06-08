/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import pkg from './package.json'
import { splitVendorChunkPlugin } from 'vite'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import slugify from 'slugify'
import preload from 'vite-plugin-preload'
import legacy from '@vitejs/plugin-legacy'
import { VitePWA } from 'vite-plugin-pwa'

process.env = {
  ...process.env,
  ...loadEnv(process.env.NODE_ENV, process.cwd()),
}
const isDev = process.env.NODE_ENV === 'development'
const VITE_PUBLIC_URL = process.env.VITE_PUBLIC_URL
const PUBLIC_URL = VITE_PUBLIC_URL || '/tradein/mtsmain' // NOTE: Prod setting by default
const BRAND_NAME = process.env.VITE_BRAND || 'SP'
const isLocalProd = process.env.VITE_LOCAL_PROD === '1'

slugify.extend({ '/': '_' })

function* Counter(initValue: number = 0) {
  let count = initValue
  while (true) yield count++
}
const chuncksCounter = Counter(0)
const modulesToSeparate = [
  // 'xstate',
  'axios',
  'retry-axios',
  'use-dynamic-refs',
  'react-hook-form',
  '@headlessui/react',
  '@xstate/react',
  '@heroicons/react',
  'framer-motion',
  'react-modal-sheet',
  // 'react-phone-input-2',
]
const _chunksMap = new Map()

// https://vitejs.dev/config/
export default defineConfig({
  // server: { port: 2023 },
  // preview: { port: 2024 },
  base: './', // NOTE: See also https://vite-plugin-ssr.com/base-url
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    preload(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    VitePWA({
      mode: isDev ? 'development' : 'production',
      // NOTE: Default 'public'
      srcDir: 'public/static3/pwa/',
      outDir: 'dist',
      filename: 'sw.js',
      // NOTE: Default 'manifest.webmanifest'
      manifestFilename: 'webmanifest.json',
      strategies: 'injectManifest', // 'generateSW',
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      minify: false,
      selfDestroying: true,
      manifest: {
        theme_color: "#3882c4",
        background_color: "#3882c4",
        name: `${BRAND_NAME} Offline Trade-In`,
        short_name: `${BRAND_NAME} Trade-In`,
        start_url: `${PUBLIC_URL}/?debug=1`,
        scope: PUBLIC_URL,
        // scope: "./",
        icons: [
          {
            src: `${PUBLIC_URL}/static3/favicon.ico`,
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon"
          },
          {
            purpose: "maskable",
            sizes: "512x512",
            src: `${PUBLIC_URL}/static3/pwa/icon512_maskable.png`,
            type: "image/png"
          },
          {
            purpose: "any",
            sizes: "512x512",
            src: `${PUBLIC_URL}/static3/pwa/icon512_rounded.png`,
            type: "image/png"
          }
        ],
        orientation: "any",
        display: "standalone",
        // display_override: ["fullscreen", "minimal-ui"],
        lang: "ru-RU"
      },
      // -- NOTE: workbox exp; See also https://vite-pwa-org.netlify.app/workbox/generate-sw.html
      // workbox: {
      //   cleanupOutdatedCaches: true,
      //   runtimeCaching: [
      //     {
      //       urlPattern: /^https:\/\/jsonplaceholder\.typicode\.com\/todos/i,
      //       handler: 'NetworkFirst', // 'NetworkFirst', // 'NetworkOnly',
      //       options: {
      //         cacheName: `pwa-cache-v${pkg.version}-pack-0.0.8`,
      //         networkTimeoutSeconds: 3,
      //         expiration: {
      //           maxEntries: 1,
      //           maxAgeSeconds: 60 * 60 * 24, // NOTE: (secs)
      //           purgeOnQuotaError: false, // NOTE: Очистить при ошибке квоты
      //         },
      //         backgroundSync: {
      //           name: `pwa-cache-v${pkg.version}-pack-0.0.8`, // NOTE: Queue Name should be unique!
      //           options: {
      //             // forceSyncFallback: true,
      //             maxRetentionTime: 60 * 24, // NOTE: (mins) Попытка выполнения повторного запроса будет выполнена в течение 24 часов (в минутах)
      //           }
      //         },
      //       },
      //       method: 'POST',
      //     },
      //   ],
      // },
      // --
      useCredentials: true,
      includeManifestIcons: true,
      disable: !isLocalProd, // true, // isDev || isLocalProd,
      devOptions: {
        enabled: true,
      },
    }),

    // NOTE: Last one
    // See also https://www.npmjs.com/package/rollup-plugin-visualizer
    // @ts-ignore
    visualizer({
      title: `Stats | Trade-In v${pkg.version}`,
      template: 'sunburst', // sunburst, treemap, network
      emitFile: true,
      filename: 'stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      // '~sw': path.resolve(__dirname, 'sw.src'),
    },
    extensions: [
      '.mjs',
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.json',
      '.vue'
    ]
  },
  build: {
    // NOTE: See also https://github.com/marcofugaro/browserslist-to-esbuild/blob/main/test/test.js
    target: browserslistToEsbuild(),
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id: string, _manualChunkMeta) {
          for (const moduleSubstr of modulesToSeparate) {
            // NOTE: Reducing the vendor chunk size
            // See also https://dev.to/tassiofront/splitting-vendor-chunk-with-vite-and-loading-them-async-15o3
            if (id.includes(moduleSubstr)) {
              const normalizedModuleSubstr = slugify(moduleSubstr)
              const fromMap = _chunksMap.get(normalizedModuleSubstr)
              if (!fromMap) {
                const chunkName = `chunk.${chuncksCounter.next().value}.${normalizedModuleSubstr}`
                _chunksMap.set(normalizedModuleSubstr, chunkName)
                return chunkName
              } else return _chunksMap.get(normalizedModuleSubstr)
            }
          }
        },
      },
    },
  },
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment analytics lib to work
    global: 'globalThis',
  },
})
