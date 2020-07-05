'use strict';

module.exports = (sequelize, DataTypes) => {
  const userlot = sequelize.define('userlot', {
    userId: DataTypes.INTEGER,
    lotId: DataTypes.INTEGER
  }, {});

  userlot.associate = function(models) {};

  return userlot;
}
