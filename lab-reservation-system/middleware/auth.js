// Require role function to add veryify role of user for protected routes
function requireRole(role) {
  return function(req, res, next) {
    if (req.session.user.role === role) {
        return next();
      } else {
        // Log access control failure
        const Error_Log = require('../models/Error_Log');
        let error = new Error_Log({
          type: "Access Control Failure",
          where: `Auth Middleware : requireRole(${role})`,
          description: `Unauthorized access attempt by user ${req.session.user?.email || 'unknown'} for role ${role}`,
          error: req.session.user
        });
        error.save();
        return res.redirect('/logout');
      }
  };
}

// Require role function to add veryify role of user for protected routes
function requireRole(role1, role2) {
  return function(req, res, next) {
    if (req.session.user.role === role1 || req.session.user.role === role2) {
        return next();
      } else {
        // Log access control failure
        const Error_Log = require('../models/Error_Log');
        let error = new Error_Log({
          type: "Access Control Failure",
          where: `Auth Middleware : requireRole(${role1},${role2})`,
          description: `Unauthorized access attempt by user ${req.session.user?.email || 'unknown'} for roles ${role1},${role2}`,
          error: req.session.user
        });
        error.save();
        return res.redirect('/logout');
      }
  };
}

module.exports = { authCheck, requireRole };