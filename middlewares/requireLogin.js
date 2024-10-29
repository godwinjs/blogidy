module.exports = async (req, res, next) => {
  await next();

  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }

};
