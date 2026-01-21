import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        // Make URL env vars available to shared packages if they use process.env
        'process.env.VITE_APP_WWW_URL': JSON.stringify(env.VITE_APP_WWW_URL),
        'process.env.VITE_APP_GOV_URL': JSON.stringify(env.VITE_APP_GOV_URL),
        'process.env.VITE_APP_DOCS_URL': JSON.stringify(env.VITE_APP_DOCS_URL)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});