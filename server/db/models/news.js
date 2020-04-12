'use strict';
module.exports = (sequelize, DataTypes) => {
  const news = sequelize.define('news', {
    text: DataTypes.STRING,
    title: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  news.associate = function(models) {
    news.belongsTo(models.users, {
      foreignKey: 'userId'
    })
  };
  return news;
};
