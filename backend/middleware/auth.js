const jwt = require('jsonwebtoken');

// Function to check if the user has admin role
const checkAdminRole = (req, res, next) => {
  if (req.user.role === 'admin') {
    next(); // Allow access if admin
  } else {
    return res.status(403).json({ msg: 'Unauthorized: Only admins can perform this action.' });
  }
};

module.exports = function (req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};