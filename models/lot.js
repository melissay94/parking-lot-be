'use strict';

module.exports = (sequelize, DataTypes) => {
  const lot = sequelize.define('lot', {
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 50],
          msg: "Invalid name length. Must be between 6 and 50 characters."
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      len: {
        args: [0, 9999],
        msg: "Invalid length. Entry cannot exceed 9999 characters."
      }
    },
    code: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8,8],
          msg: "Codes must be of length 8." 
        }
      }
    },
    authorId: DataTypes.INTEGER
  }, {});

  lot.associate = function(models) {
    lot.hasMany(models.entry);
    lot.belongsToMany(models.user, { through: "userlot" });
    lot.belongsTo(models.user, { as: "createdLot", constraints: false });
  };

  return lot;
}
