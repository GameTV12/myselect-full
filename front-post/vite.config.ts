import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      react(),
    federation({
      name: 'front_post',
      filename: 'remoteEntry.js',
      // Modules to expose
      exposes: {
        './WritePost': './src/WritePost'
      },
      shared: ['react', 'react-dom']
    })
  ],
  server: {
    host: "127.0.0.1",
    port: 3002
  },
  preview: {
    host: "127.0.0.1",
    port: 3002,
  },
  cacheDir: "node_modules/.cacheDir",
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
