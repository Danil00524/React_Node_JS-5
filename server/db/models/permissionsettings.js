'use strict';
module.exports = (sequelize, DataTypes) => {
  const permissionSettings = sequelize.define('permissionSettings', {
    C: DataTypes.BOOLEAN,
    R: DataTypes.BOOLEAN,
    U: DataTypes.BOOLEAN,
    D: DataTypes.BOOLEAN,
    __id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    }
  }, {});
  return permissionSettings;
};
