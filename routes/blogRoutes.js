const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
// const {clearHash} = require('../services/cache')
const cleanCache = require('../middlewares/cleanCache')

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    req.user = { id: "6713527cfba9cb302476345d"}

    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {

    // req.user = { id: "6713527cfba9cb302476345d"}

    // mongo
    const blogs = await Blog.find({ _user: req.user.id }).cache({key: req.user.id});

    res.send(blogs);
  });

  app.post('/api/blog', requireLogin, cleanCache, async (req, res) => {
    const { title, content } = req.body;
    
    // req.user = { id: "6713527cfba9cb302476345d"}

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();

    } catch (err) {
      res.send(400, err);
    }

    // clearHash(req.user.id);

  });
};
