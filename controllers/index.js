const express = require('express');
const router = express.Router();

const userRoutes = require("./api/userRoutes.js");
const blogRoutes = require("./api/blogRoutes");
const commentRoutes = require("./api/commentRoutes");
const frontEndRoutes = require("./frontendRoutes");

router.use("/api/users", userRoutes);
router.use("/api/blogs", blogRoutes);
router.use("/api/comments", commentRoutes);
router.use("/", frontEndRoutes);

// Catch-all error handler
router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = router;