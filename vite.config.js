import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { createBlockletPlugin } from 'vite-plugin-blocklet';

console.log('------------------------------------');
console.log(111);
console.log('------------------------------------');

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), createBlockletPlugin()],
    optimizeDeps: {
      force: true,
    },
  };
});
