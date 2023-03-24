/* eslint-disable no-console */
require('dotenv-flow').config();

const { server } = require('./functions/app');

const port = parseInt(process.env.BLOCKLET_PORT, 10) || 3030;
server.listen(port, (err) => {
  if (err) throw err;
  console.log(`> app ready on ${port}`);
});

module.exports = {
  app: server,
};
