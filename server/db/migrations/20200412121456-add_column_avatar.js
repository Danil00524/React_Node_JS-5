'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'avatar', Sequelize.STRING);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
