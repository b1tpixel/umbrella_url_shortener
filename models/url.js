'use strict';
module.exports = (sequelize, DataTypes) => {
  var Url = sequelize.define('Url', {
    original: DataTypes.STRING,
    custom: DataTypes.STRING,
    timesUsed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  });
  return Url;
};