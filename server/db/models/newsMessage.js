module.exports = (sequelize, DataTypes) => {
  const newsmessage = sequelize.define("newsmessage", {
    text: {
      type: DataTypes.TEXT
    },
    theme: {
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.DATE
    }
  });
  newsmessage.associate = function (models) {
    newsmessage.belongsTo(models.users);
  }
  return newsmessage;
};
