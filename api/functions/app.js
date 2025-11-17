/* eslint-disable no-console */
const path = require('path');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const middleware = require('@blocklet/sdk/lib/middlewares');
const logger = require('@blocklet/logger');

const userRoutes = require('../routes/user');
const events = require('../libs/event');

const isProduction = process.env.NODE_ENV !== 'development';

// Create and config express application
const server = express();

events.init();

logger.setupAccessLogger(server);

server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());

const router = express.Router();

userRoutes.init(router);

if (isProduction || process.env.PREVIEW) {
  server.use(router);

  const staticDir = path.resolve(__dirname, '../../', 'dist');
  server.use(express.static(staticDir, { maxAge: '365d', index: false }));
  server.use(middleware.fallback('index.html', { root: staticDir }));

  server.use((req, res) => {
    res.status(404).send('404 NOT FOUND');
  });

  // eslint-disable-next-line no-unused-vars
  server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
} else {
  server.use(router);
}

module.exports = { server };
