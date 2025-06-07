// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [tailwindcss(), react()],
// });

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://api.gahoishakti.in',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => {
          console.log('Rewriting path:', path);
          return path;
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy Error:', err);
            if (!res.headersSent) {
              res.writeHead(500, {
                'Content-Type': 'application/json',
              });
              res.end(JSON.stringify({ error: 'Proxy Error', message: err.message }));
            }
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Sending Request:', {
              method: req.method,
              url: req.url,
              path: proxyReq.path,
              headers: proxyReq.getHeaders()
            });
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response:', {
              status: proxyRes.statusCode,
              url: req.url,
              path: req.path,
              contentType: proxyRes.headers['content-type']
            });

            let body = '';
            proxyRes.on('data', (chunk) => {
              body += chunk;
            });
            proxyRes.on('end', () => {
              try {
                JSON.parse(body);
                res.end(body);
              } catch (parseError) {
                if (body.includes('<!DOCTYPE html>')) {
                  res.writeHead(500, {
                    'Content-Type': 'application/json',
                  });
                  res.end(JSON.stringify({
                    error: 'Invalid Response',
                    message: 'Received HTML when expecting JSON'
                  }));
                } else {
                  res.end(body);
                }
              }
            });
          });
        }
      },
      '^/wpsenders/.*': {
        target: 'https://www.wpsenders.in',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/wpsenders/, ''),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Control-Allow-Origin': '*'
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
