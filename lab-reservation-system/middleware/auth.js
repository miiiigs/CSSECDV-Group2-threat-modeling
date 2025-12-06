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

function newAuthCheck() {
  return function(req, res, next) {

    // Checks if there is a session or if the session has the 'user' property/object
    if (!req.session || !req.session.user) {
      return res.redirect('/login');
    }
    
    console.log(req.session.user.firstName + " " + req.session.user.lastName + " | " + req.session.user._id);

    if (req.session.user.role === 'student' || req.session.user.role === 'labtech' || req.session.user.role === 'admin') {
        console.log("Passed through | Role is " + req.session.user.role);
        return next();
      } else {
        console.log("Something went wrong 1");
        return res.redirect('/logout');
    }
  };
}

module.exports = { isAuthenticated, newAuthCheck }; 