const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    // redis
    const redis = require('redis')
    const redisUrl = 'redis://127.0.0.1:6379'
    const client = redis.createClient(redisUrl)
    client.connect()

    // mongo
    const blogs = await Blog.find({ _user: req.user.id });
    // redis: get cached data that exist in the redisDB for this query [req.user.id]
    const cachedBlogs = await client.get(req.user.id)

    // if cashed data exists, res to this req with the cached data
    if(cachedBlogs) {
      console.log('serving ' + req.user.id +' from cache')
      return res.send(JSON.parse(cachedBlogs))
    }

    // if not, respond to the request with the data from mongoDB and update/cache the data for the query in redisDB
    console.log('serving from mongoDB')
    res.send(blogs);
    client.set(req.user.id, JSON.stringify(blogs))
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

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
  });
};
