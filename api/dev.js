const { setupClient } = require('vite-plugin-blocklet');

const { app } = require('./index');

setupClient(app, { port: 12345 });
