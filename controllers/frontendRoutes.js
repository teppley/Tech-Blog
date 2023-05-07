const express = require('express');
const router = express.Router();
const {User,Blog, Comment} = require('../models');

// GET route for home page
router.get('/', (req, res) => {
    Blog.findAll({include: [User]}).then(blogs => {
        const hbsBlogs = blogs.map(blog=>blog.get({plain:true}))
        const loggedIn = req.session.user?true:false;
        // Render the home page and pass in the blogs and whether the user is logged in
        res.render('home', {blogs:hbsBlogs, loggedIn, username:req.session.user?.username})
    })
})

// GET route for login page
router.get("/login",(req,res)=>{
    if(req.session.user){
        return res.redirect("/dashboard")
    }
    // Render the login page
    res.render("login")
})

// GET route for signup page
router.get("/signup",(req,res)=>{
    // Render the signup page
    res.render("signup")
})

// GET route for user dashboard
router.get("/dashboard",(req,res)=>{
    if(!req.session.user) {
        return res.redirect('/login')
    }
    User.findByPk(req.session.user.id, {
        include: [Blog, Comment]
    }).then(userData => {
        const hbsData = userData.get({plain:true})
        hbsData.loggedIn = req.session.user?true:false
        // Render the user dashboard and pass in the user data and whether the user is logged in
        res.render("dashboard", hbsData)
    })
})

// GET route for a single post
router.get("/blogs/:id", (req, res) =>{
    if(!req.session.user) {
        return res.redirect('/login')
    }
    // Find the post with the given ID and include its user and comments
    Blog.findByPk(req.params.id,{include:[User, {model: Comment, include: [User]}]})
    .then(dbBlog => {
        const hbsBlog = dbBlog.get({plain:true})
        const loggedIn = req.session.user?true:false;
        console.log('==============')
        console.log(hbsBlog)
        if (dbBlog.userId != req.session.user.id) {
            // If the post is not yours, render the comment page over the homepage
            return res.render('comment', {hbsBlog, loggedIn, username:req.session.user?.username})
        }
        // If the post is yours, render the update/delete page over your dashboard
        res.render("updateDelete", {hbsBlog, loggedIn, username:req.session.user?.username})
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ msg: "an error occured", err });
      });
})

// Wildcard route to redirect to home page for any unrecognized paths
router.get("*",(req,res)=>{
    res.redirect("/")
})

module.exports = router;
