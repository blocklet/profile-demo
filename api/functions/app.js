/* eslint-disable no-console */
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fallback from '@blocklet/sdk/lib/middlewares/fallback';

import userRoutes from '../routes/user';

const isProduction = process.env.NODE_ENV !== 'development';

// Create and config express application
const server = express();
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());

const router = express.Router();

userRoutes.init(router);

if (isProduction) {
  server.use(
    morgan((tokens, req, res) => {
      const log = [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms',
      ].join(' ');

      if (isProduction) {
        // Log only in AWS context to get back function logs
        console.log(log);
      }

      return log;
    }),
  );
  server.use(router);

  const staticDir = path.resolve(__dirname, '../../', 'dist');
  server.use(express.static(staticDir, { maxAge: '365d', index: false }));
  server.use(fallback('index.html', { root: staticDir }));

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

export { server };
