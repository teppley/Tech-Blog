const express = require("express");
const router = express.Router();
const { User, Blog, Comment } = require("../../models");

// Middleware to check if the user is authenticated
const withAuth = (req, res, next) => {
  if (!req.session.user) {
    res.status(401).json({ msg: "Please login first!" });
  } else {
    next();
  }
};

// GET all comments in the database
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.findAll({ include: [User, Blog] });
    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "An error occured", err });
  }
});

// GET a specific comment by ID
router.get("/:id", async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [User, Blog],
    });
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }
    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "An error occured", err });
  }
});

// POST a new comment
router.post("/", withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      body: req.body.body,
      userId: req.session.user.id,
      blogId: req.body.blogId,
    });
    res.json(newComment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "An error occured", err });
  }
});

// PUT update a specific comment by ID
router.put("/:id", withAuth, async (req, res) => {
  try {
    const [numRows, updatedComment] = await Comment.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (numRows === 0) {
      return res.status(404).json({ msg: "Comment not found" });
    }
    res.json(updatedComment[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "An error occured", err });
  }
});

// DELETE a specific comment by ID
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const numRows = await Comment.destroy({
      where: { id: req.params.id },
    });
    if (numRows === 0) {
      return res.status(404).json({ msg: "Comment not found" });
    }
    res.json({ msg: "Comment deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "An error occured", err });
  }
});

module.exports = router;
