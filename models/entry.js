'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class entry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      entry.hasMany(models.comment);
      entry.belongsTo(models.user);
      entry.belongsTo(models.lot);
    }
  };
  entry.init({
    title: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 50],
          msg: "Invalid title length. Must be between 6 and 50 characters."
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [0, 300],
          msg: "Invalid description length. Must be less than 300 characters."
        }
      }
    },
    type: DataTypes.INTEGER,
    lotId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'entry',
  });
  return entry;
};
