const passport = require('passport');
const expressSessionFix = require('../middlewares/expressSessionFix')

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/blogs');
      // res.redirect('/');
    }
  );

  app.get('/auth/logout', (req, res) => {
    // console.log(req)
    req.logout(() => res.redirect('/'));
    // res.redirect('/');
  });

  app.get('/api/current_user', expressSessionFix, (req, res) => {
    console.log("'/api/current_user", req.user)
    res.send(req.user);
  });
};
