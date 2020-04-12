'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'refreshToken', Sequelize.STRING);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
