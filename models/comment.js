"use strict";

module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    text: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 1000],
          msg: "Invalid comment length. Must be between 1 and 1000 characters."
        }
      }
    },
    userId: DataTypes.INTEGER,
    entryId: DataTypes.INTEGER
  }, {});

  comment.associate = function(models) {
    comment.belongsTo(models.user);
    comment.belongsTo(models.entry);
  };

  return comment;
}
