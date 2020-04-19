'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    surName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING
  }, {});
  return users;
};
