const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  console.log("Token received in request: ", token);  // Log token received

  // Check if no token
  if (!token) {
    console.log('No token provided.');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token: ", decoded);  // Log the decoded token
    
    if (!decoded || !decoded.user) {
      console.log('Invalid token structure.');
      return res.status(401).json({ msg: 'Token is not valid' });
    }

    req.user = decoded.user; // Assign the decoded user to req.user
    next();
  } catch (err) {
    console.error('Token verification failed: ', err.message);  // Log error details
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
