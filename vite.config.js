import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://api.gahoishakti.in',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy Error:', err);
            res.writeHead(500, {
              'Content-Type': 'application/json',
            });
            res.end(JSON.stringify({ error: 'Proxy Error', message: err.message }));
          });
        }
      },
      '/wpsenders': {
        target: 'https://www.wpsenders.in',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/wpsenders/, '/api'),
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.log('WP Senders Proxy Error:', err);
            res.writeHead(500, {
              'Content-Type': 'application/json',
            });
            res.end(JSON.stringify({ error: 'WP Senders Proxy Error', message: err.message }));
          });
        }
      }
    },
  },
  assetsInclude: ['**/*.woff', '**/*.woff2'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          fonts: ['@fontsource/noto-sans-devanagari', '@fontsource/inter']
        }
      }
    }
  }
})
