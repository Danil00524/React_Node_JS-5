'use strict';
module.exports = (sequelize, DataTypes) => {
  const permissionNews = sequelize.define('permissionNews', {
    C: DataTypes.BOOLEAN,
    R: DataTypes.BOOLEAN,
    U: DataTypes.BOOLEAN,
    D: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER
  }, {});
  permissionNews.associate = function(models) {
    permissionNews.belongsTo(models.users, {
      foreignKey: 'userId',
    })
  };
  return permissionNews;
};
