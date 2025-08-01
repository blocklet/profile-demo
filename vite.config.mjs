import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { createBlockletPlugin } from 'vite-plugin-blocklet';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const exclude = [];
  const alias = {};
  if (mode === 'production') {
    // alias.lodash = 'lodash-es';
    alias['lodash.assign'] = 'lodash/assign';
    alias['lodash.clonedeep'] = 'lodash/cloneDeep';
    alias['lodash.isequal'] = 'lodash/isEqual';
    alias['lodash.merge'] = 'lodash/merge';
    alias['lodash.find'] = 'lodash/find';
  }
  if (env.ENABLED_ALIAS_BLOCKLET === 'true') {
    const excludeLibs = [
      // 排除 ux repo 中其他的包
      // '@arcblock/bridge',
      '@arcblock/icons',
      '@arcblock/react-hooks',
      '@arcblock/nft-display',
      // 排除 ux repo 中 使用到 server repo 的包
      // '@blocklet/meta',
      // '@blocklet/js-sdk',
      // 排除带有公共 context 的包
      'react',
      'react-router-dom',
      '@emotion/react',
      '@emotion/styled',
      '@mui/icons-material',
      '@mui/material',
      'notistack',
      // 'flat',
    ];
    if (env.ARCBLOCK_UX_BASE_PATH) {
      alias['@arcblock/ux/lib'] = `${env.ARCBLOCK_UX_BASE_PATH}/packages/ux/src`;
      alias['@arcblock/did-connect/lib'] = `${env.ARCBLOCK_UX_BASE_PATH}/packages/did-connect/src`;
      alias['@blocklet/ui-react/lib'] = `${env.ARCBLOCK_UX_BASE_PATH}/packages/blocklet-ui-react/src`;
      alias['@blocklet/ui-react'] = `${env.ARCBLOCK_UX_BASE_PATH}/packages/blocklet-ui-react/src/index.ts`;
      alias['@arcblock/bridge'] = `${env.ARCBLOCK_UX_BASE_PATH}/packages/bridge/src/index.js`;
      // alias['@blocklet/launcher-layout/lib'] = `${env.ARCBLOCK_UX_BASE_PATH}/packages/blocklet-launcher-layout/src`;
      // alias['@blocklet/launcher-layout'] =
      //   `${env.ARCBLOCK_UX_BASE_PATH}/packages/blocklet-launcher-layout/src/index.jsx`;

      excludeLibs.forEach((x) => {
        alias[x] = path.join(process.cwd(), `./node_modules/${x}`);
      });

      exclude.push('@blocklet/did-space-react');
    }
  }
  return {
    plugins: [
      react(),
      svgr(),
      createBlockletPlugin(),
      VitePWA({
        manifest: false,
        injectRegister: false,
        registerType: 'autoUpdate',
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'service-worker.js',
        injectManifest: {
          maximumFileSizeToCacheInBytes: 6291456,
        },
      }),
    ],
    resolve: {
      alias,
      dedupe: [
        //
        '@mui/material',
        // '@mui/utils', // 由于其他包中还使用了 mui/utils 的旧版本，所以不能进行强制去重
        '@mui/icons-material',
        'react',
        'react-dom',
        'lodash',
        'bn.js',
      ],
    },
    server: {
      force: true,
      fs: {
        strict: false,
      },
    },
    optimizeDeps: {
      // force: true,
      exclude,
    },
  };
});
