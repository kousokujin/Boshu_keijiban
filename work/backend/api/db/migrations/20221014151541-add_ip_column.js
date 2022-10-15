'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn('Members','IPaddr',{
      type: Sequelize.TEXT,
      after: "discription"
    });
    await queryInterface.addColumn('Recruitments','IPaddr',{
      type: Sequelize.TEXT,
      after: "member_cnt",
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Members','IPaddr');
    await queryInterface.removeColumn('Recruitments','IPaddr');
  }
};
