// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        return jwt.verify(token, process.env.JWT_SECRET);
      } catch (e) {
        throw new Error('Invalid or expired token');
      }
    }
  }
  throw new Error('Authorization header must be provided');
};

module.exports = auth;
