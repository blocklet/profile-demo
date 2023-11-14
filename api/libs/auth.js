const path = require('path');
const GraphQLClient = require('@ocap/client');
const AuthService = require('@blocklet/sdk/service/auth');
const AuthNedbStorage = require('@arcblock/did-auth-storage-nedb');
const getWallet = require('@blocklet/sdk/lib/wallet');
const WalletAuthenticator = require('@blocklet/sdk/lib/wallet-authenticator');
const WalletHandler = require('@blocklet/sdk/lib/wallet-handler');

const client = new GraphQLClient(process.env.CHAIN_HOST);

const wallet = getWallet();
const authenticator = new WalletAuthenticator({
  // wallet({ request }) {
  //   console.log(Object.keys(request), request.cookies, request.headers);
  //   return null;
  // },
});

const tokenStorage = new AuthNedbStorage({
  dbPath: path.join(process.env.BLOCKLET_DATA_DIR || './', 'auth.db'),
  onload: (err) => {
    if (err) {
      logger.error(`Failed to load database from ${path.join(process.env.BLOCKLET_DATA_DIR || './')}`, err);
    }
  },
});

const walletHandlers = new WalletHandler({
  authenticator,
  tokenStorage,
});

module.exports = {
  wallet,
  client,
  tokenStorage,
  authenticator,
  walletHandlers,
  authClient: new AuthService(),
};
