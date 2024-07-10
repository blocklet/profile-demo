const { app, server } = require('./index');

import('vite-plugin-blocklet').then(({ setupClient }) => {
  setupClient(app);
});

if (import.meta.hot) {
  async function killServer() {
    await server.close((err) => {
      console.log('server closed');
    });
  }
  import.meta.hot.on('vite:beforeFullReload', async () => {
    console.log('full reload');
    await killServer();
  });

  import.meta.hot.dispose(async () => {
    console.log('dispose');
    await killServer();
  });
}
