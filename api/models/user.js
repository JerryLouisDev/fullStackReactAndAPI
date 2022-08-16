"use strict";

const { Model } = require("sequelize");
const bcrpyt = require("bcryptjs");
// const sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A First Name is required",
          },
          notEmpty: {
            msg: "Please provide a First Name",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A Last Name is required",
          },
          notEmpty: {
            msg: "Please provide a Last Name",
          },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A Email is required",
          },
          notEmpty: {
            msg: "Please provide a Email",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
          const hashedPassword = bcrpyt.hashSync(val, 10);
          this.setDataValue("password", hashedPassword);
        },
        validate: {
          notNull: {
            msg: "A Password is required",
          },
          notEmpty: {
            msg: "Please provide a Password",
          },
        },
      },
    },
    {
      sequelize,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Course, {
      as: "User", // alias
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };

  return User;
};
