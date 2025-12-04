// Authentication middleware
function isAuthenticated(role) {
  return function(req, res, next) {
    if (!req.session || !req.session.user) {
      return res.redirect('/login');
    }

    if (role === 'LabTech') {
      if (req.session.user.role === 'labtech') {
        return next();
      } else {
        return res.redirect('/logout');
      }
    } 
    else if (role === 'Student') {
      if (req.session.user.role === 'student') {
        return next();
      } else {
        return res.redirect('/logout');
      }
    }
    else if (role === 'Admin') {
      if (req.session.user.role === 'admin') {
        return next();
      } else {
        return res.redirect('/logout');
      }
    }
    else {
      // Invalid role specified
      return res.redirect('/logout');
    }
  };
}

module.exports = { isAuthenticated }; 