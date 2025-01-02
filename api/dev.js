const { app, server } = require('./index');

if (!process.env.PREVIEW) {
  import('vite-plugin-blocklet').then(({ setupClient }) => {
    setupClient(app, {
      server,
      // importMetaHot: import.meta.hot,
    });
  });
}
