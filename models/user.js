'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');

//User Model
module.exports = (sequelize) => {
  class User extends Model {};
  User.init({
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName:{ 
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: {
          msg: "'first name' is required "
        },
        notEmpty: {
          msg:"Please enter a 'first name'"
        }
      }
    },
    lastName:{
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: {
          msg: "'last name' is required "
        },
        notEmpty: {
          msg:"Please enter a 'last name'"
        }
      }
    },
    emailAddress:{
      type: DataTypes.STRING,
      allowNull: false,
      unique:{
        msg: "This email is already associated with another user."
      },
      validate: {
        notNull: {
          msg: "'email' is required "
        },
        isEmail: {
          msg: "Please provide a valid email address."
        }
      }
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: {
          msg: "'password' is required "
        },
        notEmpty: {
          msg:"Please enter a 'password'"
        },
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.associate = (models) => {
      User.hasMany(models.Course, {
        as: 'userInfo',
        foreignKey: {
          fieldName: 'userId',
          allowNull: false,
        },
      });
  };

  return User;
}