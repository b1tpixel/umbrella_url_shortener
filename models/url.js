'use strict';
module.exports = (sequelize, DataTypes) => {
  var Url = sequelize.define('Url', {
    original: DataTypes.STRING,
    shortened: DataTypes.STRING
  });
  return Url;
};