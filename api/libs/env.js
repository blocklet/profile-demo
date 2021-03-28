/* eslint-disable operator-linebreak */
module.exports = {
  appId:
    process.env.BLOCKLET_APP_ID ||
    process.env.REACT_APP_APP_ID ||
    process.env.GATSBY_APP_ID ||
    process.env.APP_ID ||
    process.env.appId ||
    '',
  appName:
    process.env.REACT_APP_APP_NAME ||
    process.env.GATSBY_APP_NAME ||
    process.env.APP_NAME ||
    process.env.appName ||
    'Auth Demo',
};
