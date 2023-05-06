const sequelize = require("../config/connection")
const {User,Blog,Comment} = require("../models")

const users = [
  {
    username: "emela",
    password: "1234"
  },
  {
    username: "monkey",
    password: "tail"
  },
  {
    username: "suzy",
    password: "cold"
  }
]

const blog = [
  {
    title: "new post",
    content: "very cool",
    userId: "1"
  },
  {
    title: "hot action",
    content: "super hot!!",
    userId: "2"
  },
  {
    title: "I like kitties",
    content: "fluffy kitties",
    userId: "3"
  },
  {
    title: "platypus",
    content: "very interesting",
    userId: "4"
  }
]

const comments = [
  {
    body: "cool indeed",
    blogId: "1",
    userId: "1"
  },
  {
    body: "the hottest!",
    blogId: "2",
    userId: "2"
  },
  {
    body: "kitties are the best",
    blogId: "3",
    userId: "3"
  },
  {
    body: "egg laying mammals",
    blogId: "4",
    userId: "2"
  },
]

const plantSeeds = async ()=>{
  try{
      await sequelize.sync({force:true})
      await User.bulkCreate(users,{
          individualHooks:true
      });
      await Blog.bulkCreate(blogs);
      await Comment.bulkCreate(comments);
      process.exit(0);
  } catch(err){
      console.log(err)
  }
}

plantSeeds()