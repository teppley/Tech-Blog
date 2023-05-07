const express = require("express");
const router = express.Router();
const { User, Blog, Comment } = require("../../models/");
const bcrypt = require("bcrypt");

// Get all users with associated blogs and comments
router.get("/", async (req, res, next) => {
  try {
    const dbUsers = await User.findAll({
      include: [Blog, Comment]
    });
    res.json(dbUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "An error occurred", err });
  }
});

// Logout user
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Get user by id with associated blogs and comments
router.get("/:id", async (req, res, next) => {
  try {
    const dbUser = await User.findByPk(req.params.id, {
      include: [Blog, Comment]
    });
    res.json(dbUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "An error occurred", err });
  }
});

// Sign up a new user
router.post("/", async (req, res, next) => {
  try {
    const newUser = await User.create(req.body, { individualHooks: true });

    // Immediately log in user by creating a new session with id and username (set to 30 min)
    req.session.user = {
      id: newUser.id,
      username: newUser.username
    };
    res.json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "An error occurred", err });
  }
});

// Log in a user
router.post("/login", async (req, res, next) => {
  try {
    const foundUser = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    // If username is not found, send message
    if (!foundUser) {
      return res.status(400).json({ msg: "Wrong login credentials" });
    }

    // Compare password with saved hash
    if (bcrypt.compareSync(req.body.password, foundUser.password)) {

      // If password matches, create session for user
      req.session.user = {
        id: foundUser.id,
        username: foundUser.username
      };
      res.json(foundUser);
    } else {
      return res.status(400).json({ msg: "Wrong login credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "An error occurred", err });
  }
});

// Update a user
router.put("/:id", async (req, res, next) => {
  try {
    const updatedUser = await User.update(req.body, {
      where: {
        id: req.params.id
      },
      individualHooks: true
    });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "An error occurred", err });
  }
});

// Delete a user
router.delete("/:id", async (req, res, next) => {
  try {
    const delUser = await User.destroy({
      where: {
        id: req.params.id
      }
    });
    res.json(delUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "An error occurred", err });
  }
});

module.exports = router;
