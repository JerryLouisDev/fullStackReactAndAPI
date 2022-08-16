"use strict";

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Course extends Model {

        static associate(models) {
          // define association here
        }
      }
      Course.init(
        {
          title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notNull: {
                msg: "A Title is required",
              },
              notEmpty: {
                msg: "Please provide a Title",
              },
            },
          },
          description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notNull: {
                msg: "A Description is required",
              },
              notEmpty: {
                msg: "Please provide a Description",
              },
            },
          },
          estimatedTime: DataTypes.STRING,
          materialsNeeded: DataTypes.STRING,
        },
        {
          sequelize,
          modelName: "Course",
        }
      );
    
      Course.associate = (models) => {
        Course.belongsTo(models.User, {
          as: "User", // alias
          foreignKey: {
            fieldName: "userId",
            allowNull: false,
          },
        });
      };
      return Course;
}