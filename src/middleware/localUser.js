module.exports = (req, res, next) => {
  if (req.session.userLogin) {
    res.locals.userLogin = req.session.userLogin;
  } else if (req.cookies.recordarme) {
    req.session.userLogin = req.cookies.recordarme;
    res.locals.userLogin = req.cookies.recordarme;
  }
  next();
};
