const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Sarpanch = require('../models/Sarpanch');

const protectUser = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) return res.status(401).json({ message: 'User not found' });
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token invalid' });
    }
  }
  return res.status(401).json({ message: 'Not authorized, no token provided' });
};

const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Sarpanch.findById(decoded.id).select('-password');
      if (!req.admin) return res.status(401).json({ message: 'Admin access denied' });
      req.user = req.admin; // Set req.user to support adminController properties
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, admin token invalid' });
    }
  }
  return res.status(401).json({ message: 'Not authorized, no token provided' });
};

module.exports = { protectUser, protectAdmin };