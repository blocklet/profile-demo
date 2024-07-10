/* eslint-disable no-console */
import dotenv from 'dotenv-flow';
dotenv.config();

import { server as app } from './functions/app';

const port = parseInt(process.env.BLOCKLET_PORT, 10) || 3030;
const server = app.listen(port, (err) => {
const server = app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> app ready on ${port}`);
});

export { app, server };
