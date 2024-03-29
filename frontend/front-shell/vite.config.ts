import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from "@originjs/vite-plugin-federation"
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      react(),
      vue(),
      federation({
        name: 'front_shell',
        remotes: {
            front_user: "http://localhost:3005/assets/remoteEntry.js",
            front_post: "http://localhost:3002/assets/remoteEntry.js",
            front_comment: "http://localhost:3006/assets/remoteEntry.js",
        },
        shared: ['react', 'react-dom', 'react-router-dom']
      })
  ],
    server: {
      host: "127.0.0.1",
      port: 3000,
      cors: true,
    },
    preview: {
        host: "127.0.0.1",
        port: 3000,
        cors: true,
    },
    cacheDir: "node_modules/.cacheDir",
    build: {
        modulePreload: false,
        target: 'esnext',
        minify: false,
        cssCodeSplit: false
    }
})
