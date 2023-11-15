import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  // server: { port: 2023 },
  // preview: { port: 2023 },
  plugins: [
    react(),

    // NOTE: Last one
    // See also https://www.npmjs.com/package/rollup-plugin-visualizer
    visualizer({
      title: 'Stats | Trade-In v3',
      template: 'sunburst', // sunburst, treemap, network
      emitFile: true,
      filename: 'stats.html',
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
  },
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment analytics lib to work
    global: 'globalThis',
  },
})
