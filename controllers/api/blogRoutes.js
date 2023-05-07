const express = require("express");
const router = express.Router();
const { User, Blog, Comment } = require("../../models");
const withAuth = require('../../util/auth.js');

// Middleware to check for logged in user
const checkAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ msg: "Please login!" });
  }
  next();
};

// Get all blogs and associated users/comments
router.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.findAll({ include: [User, Comment] });
    res.json(blogs);
  } catch (err) {
    next(err);
  }
});

// Get one blog with associated user and comment
router.get("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id, { include: [User, Comment] });
    res.json(blog);
  } catch (err) {
    next(err);
  }
});

// Create new blog post
router.post("/", checkAuth, async (req, res, next) => {
  try {
    // Validate input data
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({ msg: "Title and content are required" });
    }

    const newBlog = await Blog.create({
      title: req.body.title,
      content: req.body.content,
      userId: req.session.user.id,
    });

    res.json(newBlog);
  } catch (err) {
    next(err);
  }
});

// Update post - with Auth
router.put("/:id", checkAuth, async (req, res, next) => {
  try {
    // Validate input data
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({ msg: "Title and content are required" });
    }

    const updatedBlog = await Blog.update(req.body, {
      where: {
        id: req.params.id,
        userId: req.session.user.id,
      },
    });

    if (updatedBlog[0] === 0) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    res.json(updatedBlog);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", checkAuth, async (req, res, next) => {
  try {
    const delBlog = await Blog.destroy({
      where: {
        id: req.params.id,
        userId: req.session.user.id,
      },
    });

    if (delBlog === 0) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    res.json(delBlog);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
