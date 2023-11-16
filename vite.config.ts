/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import pkg from './package.json'
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  // server: { port: 2023 },
  // preview: { port: 2024 },
  plugins: [
    react(),
    splitVendorChunkPlugin(),

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
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // NOTE: Reducing the vendor chunk size
          // See also https://dev.to/tassiofront/splitting-vendor-chunk-with-vite-and-loading-them-async-15o3
          switch (true) {
            case id.includes('retry-axios'):
              return '~retry-axios'
            case id.includes('use-dynamic-refs'):
              return '~use-dynamic-refs'
            case id.includes('react-hook-form'):
              return '~react-hook-form'
            case id.includes('@headlessui/react'):
              return '~@headlessui/react'
            case id.includes('@xstate/react'):
              return '~@xstate/react'
            case id.includes('@heroicons/react'):
              return '~@heroicons/react'
            default:
              break
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
