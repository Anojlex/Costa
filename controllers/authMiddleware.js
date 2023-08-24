

const isLoggedIn = (req, res, next) => {

    
    if (req.session.isAuth === "true") {
     
      return next();
    }
  
  
    res.redirect('/user/login');
  };
  
  module.exports = { isLoggedIn };
  