//Import model and datatypes from sequelize package
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Declares a new comment class
class Comment extends Model {}

Comment.init({
    body: {
        type:DataTypes.TEXT,
        allowNull:false
    },
    date: {
        type:DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
},{
    sequelize,   
    freezeTableName: true,
    underscored: true,
    modelName: 'comment',
});

module.exports=Comment