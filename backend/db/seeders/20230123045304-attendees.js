'use strict';
const { Op } = require("sequelize")

const attendees =[
  {
    eventId:1,
    userId:1
  },
  {
    eventId:1,
    userId:2
  },
  {
    eventId:2,
    userId:1
  },
  {
    eventId:2,
    userId:3
  },
  {
    eventId:3,
    userId:4
  },
  {
    eventId:3,
    userId:5
  },
  {
    eventId:4,
    userId:5
  },
  {
    eventId:4,
    userId:6
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Attendees', attendees,
    {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Attendees', {[Op.or]:attendees});
  }
};
