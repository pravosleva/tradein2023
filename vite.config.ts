/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import pkg from './package.json'
import { splitVendorChunkPlugin } from 'vite'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import slugify from 'slugify'
import preload from 'vite-plugin-preload'
import legacy from '@vitejs/plugin-legacy'

slugify.extend({ '/': '_' })

function* Counter(initValue: number = 0) {
  let count = initValue
  while (true) yield count++
}
const chuncksCounter = Counter(0)
const modulesToSeparate = [
  'retry-axios',
  'use-dynamic-refs',
  'react-hook-form',
  '@headlessui/react',
  '@xstate/react',
  '@heroicons/react',
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

    // NOTE: Last one
    // See also https://www.npmjs.com/package/rollup-plugin-visualizer
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
