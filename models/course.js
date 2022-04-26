'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');

//Course Model
module.exports = (sequelize) => {
  class Course extends Model {};
  Course.init({
    title:{ 
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: {
          msg:"Please enter a title"
        }
      }
    },
    description:{
      type: DataTypes.TEXT,
      allowNull: false,
      validate:{
        notEmpty: {
          msg:"Please enter author's name"
        }
      }
    },
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Course',
  });

  Course.associate = (models) => {
      Course.belongsTo(models.User, {
        as: 'userInfo',
        foreignKey: {
          fieldName: 'userId',
          allowNull: false,
        },
      });
  };


  return Course;
}