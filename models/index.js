const User = require("./user");
const Blog = require("./blog");
const Comment = require("./comment");

User.hasMany(Blog);
Blog.belongsTo(User);

Blog.hasMany(Comment);
Comment.belongsTo(Blog);

User.hasMany(Comment);
Comment.belongsTo(User);

module.exports = {
    User,
    Blog,
    Comment
}