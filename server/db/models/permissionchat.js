'use strict';
module.exports = (sequelize, DataTypes) => {
  const permissionChat = sequelize.define('permissionChat', {
    C: DataTypes.BOOLEAN,
    R: DataTypes.BOOLEAN,
    U: DataTypes.BOOLEAN,
    D: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER
  }, {});
  permissionChat.associate = function(models) {
    permissionChat.belongsTo(models.users, {
      foreignKey: 'userId'
    })
  };
  return permissionChat;
};
