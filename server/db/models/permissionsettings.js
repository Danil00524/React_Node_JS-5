'use strict';
module.exports = (sequelize, DataTypes) => {
  const permissionSettings = sequelize.define('permissionSettings', {
    C: DataTypes.BOOLEAN,
    R: DataTypes.BOOLEAN,
    U: DataTypes.BOOLEAN,
    D: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER
  }, {});
  permissionSettings.associate = function(models) {
    permissionSettings.belongsTo(models.users, {
      foreignKey: 'userId',
    })
  };
  return permissionSettings;
};
