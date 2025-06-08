import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'process'

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
          const newPath = path.replace(/^\/api/, '');
          console.log('Rewriting path:', { original: path, new: newPath });
          return newPath;
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VITE_API_TOKEN}`
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
            // Ensure proper headers
            proxyReq.setHeader('Accept', 'application/json');
            proxyReq.setHeader('Content-Type', 'application/json');
            if (process.env.VITE_API_TOKEN) {
              proxyReq.setHeader('Authorization', `Bearer ${process.env.VITE_API_TOKEN}`);
            }

            console.log('Sending Request:', {
              method: req.method,
              originalUrl: req.url,
              proxyPath: proxyReq.path,
              headers: proxyReq.getHeaders()
            });
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response:', {
              status: proxyRes.statusCode,
              url: req.url,
              contentType: proxyRes.headers['content-type']
            });

            // Force JSON content type
            res.setHeader('Content-Type', 'application/json');

            let body = '';
            proxyRes.on('data', (chunk) => {
              body += chunk;
            });
            proxyRes.on('end', () => {
              // If we got an error status code, return it as JSON
              if (proxyRes.statusCode >= 400) {
                res.writeHead(proxyRes.statusCode, {
                  'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({
                  error: 'API Error',
                  status: proxyRes.statusCode,
                  message: body
                }));
                return;
              }

              try {
                const jsonData = JSON.parse(body);
                res.end(JSON.stringify(jsonData));
              } catch (error) {
                // If response is HTML or invalid JSON, return error
                res.writeHead(500, {
                  'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({
                  error: 'Invalid Response',
                  message: 'Server returned invalid JSON response',
                  details: error.message
                }));
              }
            });
          });
        }
      },
      '/wpsenders': {
        target: 'https://www.wpsenders.in',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => {
          const newPath = path.replace(/^\/wpsenders/, '/api');
          console.log('Rewriting WP Senders path:', { original: path, new: newPath });
          return newPath;
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.log('WP Senders Proxy Error:', err);
            if (!res.headersSent) {
              res.writeHead(500, {
                'Content-Type': 'application/json',
              });
              res.end(JSON.stringify({ error: 'WP Senders Proxy Error', message: err.message }));
            }
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Sending WP Senders Request:', {
              method: req.method,
              originalUrl: req.url,
              proxyPath: proxyReq.path,
              headers: proxyReq.getHeaders()
            });
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received WP Senders Response:', {
              status: proxyRes.statusCode,
              url: req.url,
              contentType: proxyRes.headers['content-type']
            });

            let body = '';
            proxyRes.on('data', (chunk) => {
              body += chunk;
            });
            proxyRes.on('end', () => {
              try {
                const jsonData = JSON.parse(body);
                res.end(JSON.stringify(jsonData));
              } catch {
                // For WP Senders, return raw response if not JSON
                res.end(body);
              }
            });
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
