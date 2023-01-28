'use strict';
const { Op } = require("sequelize")

const membership = [
  {
    groupId: 2,
    userId: 1,
    status: "co-host"
  },
  {
    groupId: 2,
    userId: 2,
    status: "organizer"
  },
  {
    groupId: 2,
    userId: 3,
    status: "member"
  },
  {
    groupId: 1,
    userId: 4,
    status: "organizer"
  },
  {
    groupId: 1,
    userId: 5,
    status: "co-host"
  },
  {
    groupId: 1,
    userId: 6,
    status: "member"
  },
  {
    groupId: 1,
    userId: 2,
    status: "pending"
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