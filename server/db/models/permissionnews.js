'use strict';
module.exports = (sequelize, DataTypes) => {
  const permissionNews = sequelize.define('permissionNews', {
    C: DataTypes.BOOLEAN,
    R: DataTypes.BOOLEAN,
    U: DataTypes.BOOLEAN,
    D: DataTypes.BOOLEAN,
    __id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    }
  }, {});
  return permissionNews;
};
