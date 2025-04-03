const jwt = require('jsonwebtoken');

const auth = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        return jwt.verify(token, process.env.JWT_SECRET);
      }
    }
    return null; // Return null instead of throwing error
  } catch (e) {
    return null;
  }
};

module.exports = auth;
