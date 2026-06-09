import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Keep the proxy target configurable so it works in containers and on the host.
const apiProxyTarget = process.env.VITE_API_PROXY_TARGET || 'http://localhost:8000';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
});
