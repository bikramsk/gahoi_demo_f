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
        rewrite: (path) => {
          console.log('API Request:', path);
          return path.replace(/^\/api/, '');
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Proxying API request:', {
              originalUrl: req.url,
              targetUrl: proxyReq.path,
              method: req.method
            });
          });

          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Received API response:', {
              status: proxyRes.statusCode,
              url: req.url
            });
          });

          proxy.on('error', (err, req, res) => {
            console.error('API Proxy Error:', err);
            res.writeHead(500, {
              'Content-Type': 'application/json',
            });
            res.end(JSON.stringify({ error: 'API Proxy Error', message: err.message }));
          });
        }
      },
      '/wpsenders': {
        target: 'https://www.wpsenders.in',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => {
          console.log('WP Senders Request:', path);
          return path.replace(/^\/wpsenders/, '/api');
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Proxying WP Senders request:', {
              originalUrl: req.url,
              targetUrl: proxyReq.path,
              method: req.method
            });
          });

          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Received WP Senders response:', {
              status: proxyRes.statusCode,
              url: req.url
            });
          });

          proxy.on('error', (err, req, res) => {
            console.error('WP Senders Proxy Error:', err);
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
