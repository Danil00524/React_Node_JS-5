'use strict';
module.exports = (sequelize, DataTypes) => {
  const permissions = sequelize.define('permissions', {
    userId: DataTypes.INTEGER
  }, {});
  permissions.associate = function (models) {
    permissions.hasOne(models.users, {
      onDelete: "CASCADE",
      foreignKey: 'userId'
    });
    permissions.belongsTo(models.permissionChat, {
      foreignKey: 'userId',
    });
    permissions.belongsTo(models.permissionNews, {
      foreignKey: 'userId',
    });
    permissions.belongsTo(models.permissionSettings, {
      foreignKey: 'userId',
    });
  }
  return permissions;
};
