import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { createBlockletPlugin } from 'vite-plugin-blocklet';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      react(),
      createBlockletPlugin(),
      VitePWA({
        manifest: false,
        injectRegister: false,
        registerType: 'autoUpdate',
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'service-worker.js',
        injectManifest: {
          maximumFileSizeToCacheInBytes: 4194304,
        },
      }),
    ],
    // optimizeDeps: {
    //   force: true,
    // },
  };
});
