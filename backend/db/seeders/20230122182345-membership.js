'use strict';
const { Op } = require("sequelize")

const membership = [
  {
    groupId: 2,
    userId: 1,
    status: true
  },
  {
    groupId: 2,
    userId: 2,
    status: true
  },
  {
    groupId: 2,
    userId: 3,
    status: true
  },
  {
    groupId: 1,
    userId: 4,
    status: true
  },
  {
    groupId: 1,
    userId: 5,
    status: true
  },
  {
    groupId: 1,
    userId: 6,
    status: true
  },
  {
    groupId: 1,
    userId: 2,
    status: true
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('Memberships', membership,
    {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Memberships', {[Op.or]:membership});
}
}