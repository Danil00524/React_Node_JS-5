'use strict';
module.exports = (sequelize, DataTypes) => {
  const permissionChat = sequelize.define('permissionChat', {
    C: DataTypes.BOOLEAN,
    R: DataTypes.BOOLEAN,
    U: DataTypes.BOOLEAN,
    D: DataTypes.BOOLEAN,
    __id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    }
  }, {});
  return permissionChat;
};
