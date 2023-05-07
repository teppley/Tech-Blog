const sequelize = require("../config/connection")
const {User,Blog,Comment} = require("../models")

const users = [
    {
        username: "harry",
        password: "harrypassword"
    },
    {
        username: "peter",
        password: "peterpassword"
    },
    {
        username: "suzy",
        password: "suzypassword"
    },

]

const blogs = [
    {
        title: "My first post",
        content: "hello",
        userId: 1
    },
    {
        title: "My second post",
        content: "howdy",
        userId: 1
    },
    {
        title: "Peter's first post",
        content: "Hi i'm Peter",
        userId: 2
    },
    {
        title: "Suzy's first post",
        content: "Hi i'm Suzy",
        userId: 3
    },
]

const comments = [
    {
        body: "great post!",
        blogId: 1,
        userId: 1
    },
    {
        body: "Hey there!",
        blogId: 3,
        userId: 2
    },
    {
        body: "That's right!",
        blogId: 4,
        userId: 1
    },
    {
        body: "coding is fun!",
        blogId: 2,
        userId: 3
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