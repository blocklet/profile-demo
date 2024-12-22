const AuthService = require("@blocklet/sdk/service/auth");
const middlewares = require("@blocklet/sdk/lib/middlewares");
const component = require("@blocklet/sdk/lib/component");

const authClient = new AuthService();

module.exports = {
  init(app) {
    app.get("/api/did/user", middlewares.session(), async (req, res) => {
      res.json({
        user: req.user,
      });
    });

    app.get("/api/owner", async (req, res) => {
      const owner = await authClient.getOwner();
      res.json({ owner });
    });

    app.get("/api/user", middlewares.session(), async (req, res) => {
      if (!req.user) {
        res.json({ user: null });
        return;
      }
      try {
        const { user } = await authClient.getUser(req.user.did);
        user.role = user.role || req.user.role;
        res.json({ user });
      } catch (err) {
        console.error(err);
        res.json({ user: null });
      }
    });

    app.get("/api/call1", async (req, res) => {
      res.json({ source: "api", result: "call1" });
    });

    app.get("/api/call2", async (req, res) => {
      const random = Math.random();
      console.log("random", random);
      if (random > 0.5) {
        res.status(500).json({ error: "Random error" });
      } else {
        res.json({ source: "api", result: "call2" });
      }
    });

    app.get("/api/component/:path", async (req, res) => {
      try {
        const result = await component.call(
          {
            name: process.env.BLOCKLET_COMPONENT_DID,
            method: req.query.method || req.method,
            path: `/api/${req.params.path}`,
          },
          { retries: 5 }
        );
        res.json({ source: "component", result: result.data });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Component call failed" });
      }
    });
  },
};
