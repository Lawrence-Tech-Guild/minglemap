import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://host.docker.internal:8000",
        changeOrigin: true,
      },
    },
  },
});
