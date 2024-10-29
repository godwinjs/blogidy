module.exports = (req, res, next) => {
  console.log("X-User-Data", req.headers['x-user-data'])
  
  if(req.headers['x-user-data']) {
    req.user = JSON.parse(req.headers['x-user-data'])
  }

  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }

  next();
};
