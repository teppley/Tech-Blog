//Import necessary packages

const express = require("express");
const router = express.Router();
const {User, Blog, Comment} = require("../../models");

// Handler listens for GET requests to the root URL path and returns all comments in the database

router.get("/", (req, res) => {
    Comment.findAll({include:[User, Blog]})
      .then(dbComments => {
        res.json(dbComments);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
      });
  });

// Handler listens for GET requests to a URL path that includes a comment ID parameter

router.get("/:id", (req, res) => {
    Comment.findByPk(req.params.id,{include:[User, Blog]})
      .then(dbComment => {
        res.json(dbComment);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
      });
});

// Handler listens for POST requests to the root URL path and creates a new comment in the database

router.post("/", (req, res) => {
    if(!req.session.user){
      return res.status(401).json({msg:"Please login first!"})
  }
    Comment.create({
      body:req.body.body,
      userId:req.session.user.id,
      blogId:req.body.blogId
    })
      .then(newComment => {
        res.json(newComment);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
      });
});

// Handler listens for PUT requests for updating a specific comment with the given ID

router.put("/:id", (req, res) => {
    if(!req.session.user){
        return res.status(401).json({msg:"Please login first!"})
    }

    Comment.update(req.body, {
      where: {
        id: req.params.id
      }
    }).then(updatedComment => {
      res.json(updatedComment);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: "an error occured", err });
    });
});

// Handler listens for DEL requests for deleting a specific comment with the given ID. 

router.delete("/:id", (req, res) => {
    if(!req.session.user){
        return res.status(401).json({msg:"Please login first!"})
    }

    Comment.destroy({
      where: {
        id: req.params.id
      }
    }).then(delComment => {
      res.json(delComment);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ msg: "an error occured", err });
    });
});
  
module.exports = router;