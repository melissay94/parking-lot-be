'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: { 
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [0, 50],
          msg: "Invalid name length. Name must not exceed 50 characters."
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "Invalid email address. Must follow email address conventions."
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [12, 99],
          msg: "Invalid password length. Must be between 12 to 99 characters."
        },
        is: {
          args: /(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z]).+/,
          msg: "Missing neccessary password characters. Must include at least one lowercase letter, one uppercase letter, one number, and one symbol."
        }
      }
    },
    role: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate: (createdUser, options) => {
        if (createdUser && createdUser.password) {
          const hash = bcrypt.hashSync(createdUser.password, 10);
          createdUser.password = hash;
        }
      },
      beforeUpdate: (updatedUser, options) => {
        if (updatedUser && updatedUser.password) {
          const hash = bcrypt.hashSync(updatedUser.password, 10);
          updatedUser.password = hash;
        }
      }
    }
  });

  user.associate = function(models) {
    user.belongsToMany(models.lot, { through: "userlots" });
    user.hasMany(models.lot, {as: "createdLots", constraints: false, allowNull: true, defaultValue: null });
    user.hasMany(models.comment);
    user.hasMany(models.entry);
  };

  user.prototype.validPassword = function(passwordTyped) {
    return bcrypt.compareSync(passwordTyped, this.password);
  }

  user.prototype.toJSON = function() {
    let userData = this.get();
    delete userData.password;
    return userData;
  }

  return user;
}
