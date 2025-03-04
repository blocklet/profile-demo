const { walletHandlers } = require('../../libs/auth');

module.exports = {
  init(app) {
    walletHandlers.attach({ app, ...require('./test') });
    walletHandlers.attach({ app, ...require('./profile') });
  },
};
