const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');

function authorizationMiddleware(req, res, next) {

  const xAccessToken = req.get('x-access-token');
  if (!xAccessToken) {
    throw new ClientError(401, 'authentication required');
  } else {
    const payload = jwt.verify(xAccessToken, process.env.TOKEN_SECRET);
    req.user = payload;
    next();
  }
}

module.exports = authorizationMiddleware;
