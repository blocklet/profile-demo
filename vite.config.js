import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { createBlockletPlugin } from 'vite-plugin-blocklet';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), createBlockletPlugin()],
    // resolve: {
    //   dedupe: ['@blocklet/ui-react'],
    // },
    optimizeDeps: {
      force: true,
    },
  };
});
