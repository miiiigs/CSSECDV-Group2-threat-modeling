// Main authentication to check for valid session
function authCheck() {
  return function(req, res, next) {
    // Checks if there is a session or if the session has the 'user' property/object
    if (!req.session || !req.session.user) {
      return res.redirect('/login');
    }
    
    if (req.session.user.role === 'student' || req.session.user.role === 'labtech' || req.session.user.role === 'admin') {
        return next();
      } else {
        return res.redirect('/logout');
    }
  };
}

// Require role function to add veryify role of user for protected routes
function requireRole(role) {
  return function(req, res, next) {
    if (req.session.user.role === role) {
        return next();
      } else {
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
        return res.redirect('/logout');
      }
  };
}

module.exports = { authCheck, requireRole }; 