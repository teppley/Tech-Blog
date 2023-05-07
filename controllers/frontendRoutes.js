const express = require('express');
const router = express.Router();
const { User, Blog, Comment } = require('../models');

// Get all blogs with user information included
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll({ include: [User] });
    const hbsBlogs = blogs.map((blog) => blog.get({ plain: true }));
    const loggedIn = req.session.user ? true : false;
    res.render('home', {
      blogs: hbsBlogs,
      loggedIn,
      username: req.session.user?.username,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Render login page
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('login');
});

// Render signup page
router.get('/signup', (req, res) => {
  res.render('signup');
});

// Render dashboard page with user data and associated blogs and comments
router.get('/dashboard', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    const userData = await User.findByPk(req.session.user.id, {
      include: [Blog, Comment],
    });
    const hbsData = userData.get({ plain: true });
    hbsData.loggedIn = req.session.user ? true : false;
    res.render('dashboard', hbsData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Render single blog post with comments and user data
router.get('/blogs/:id', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    const blog = await Blog.findByPk(req.params.id, {
      include: [User, { model: Comment, include: [User] }],
    });
    const hbsBlog = blog.get({ plain: true });
    const loggedIn = req.session.user ? true : false;

    // If user is not the author of the post, render comment page
    if (blog.userId != req.session.user.id) {
      return res.render('comment', {
        hbsBlog,
        loggedIn,
        username: req.session.user?.username,
      });
    }

    // If user is the author of the post, render update/delete page
    res.render('updateDelete', {
      hbsBlog,
      loggedIn,
      username: req.session.user?.username,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Redirect all other routes to the home page
router.get('*', (req, res) => {
  res.redirect('/');
});

module.exports = router;
