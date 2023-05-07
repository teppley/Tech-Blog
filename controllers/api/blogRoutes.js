// Import necessary packages
const express = require("express");
const router = express.Router();
const { User, Blog, Comment } = require("../../models");

const withAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ msg: "Please login first!" })
  }
  next();
};

// Handler listens for GET requests to the root URL path and returns all comments in the database
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.findAll({ include: [User, Blog] });
    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "an error occured", err });
  }
});

// Handler listens for GET requests to a URL path that includes a comment ID parameter
router.get("/:id", async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id, { include: [User, Blog] });
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }
    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "an error occured", err });
  }
});

// Handler listens for POST requests to the root URL path and creates a new comment in the database
router.post("/", withAuth, async (req, res) => {
  try {
    const { body, blogId } = req.body;
    const userId = req.session.user.id;
    if (!body || !blogId) {
      return res.status(400).json({ msg: "Please provide body and blogId" });
    }
    const newComment = await Comment.create({ body, userId, blogId });
    res.json(newComment);
  } catch (err) {
    console.log(err);
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({ msg: err.errors[0].message });
    }
    res.status(500).json({ msg: "an error occured", err });
  }
});

// Handler listens for PUT requests for updating a specific comment with the given ID
router.put("/:id", withAuth, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }
    await comment.update(req.body);
    res.json(comment);
  } catch (err) {
    console.log(err);
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({ msg: err.errors[0].message });
    }
    res.status(500).json({ msg: "an error occured", err });
  }
});
// Deletes a specific comment from the database using the comment ID.
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }
    await comment.destroy();
    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "an error occured", err });
  }
});

module.exports = router;
