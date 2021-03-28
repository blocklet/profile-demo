const env = require('../libs/env');
const AuthService = require('@blocklet/sdk/service/auth');

const authClient = new AuthService();

module.exports = {
  init(app) {
    app.get('/api/did/user', async (req, res) => {
      res.json({
        user: req.user,
      });
    });

    app.get('/api/user', async (req, res) => {
      if (!req.user) {
        res.json({
          user: null
        });
        return;
      }
      const { user } = await authClient.getUser(req.user.did);
      res.json({
        user
      });
    });

    app.get('/api/env', (req, res) => {
      res.type('js');
      res.send(`window.env = ${JSON.stringify(env, null, 2)}`);
    });
  },
};
