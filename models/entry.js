'use strict';

module.exports = (sequelize, DataTypes) => {
  const entry = sequelize.define('entry', {
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
  }, {});

  entry.associate = function(models) {
    entry.hasMany(models.comment);
    entry.belongsTo(models.user);
    entry.belongsTo(models.lot);
  };

  return entry;
}
