'use strict';
const { Op } = require("sequelize")
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

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
    options.tableName = 'Attendees';
    return queryInterface.bulkInsert(options, attendees,
    {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Attendees';
    return queryInterface.bulkDelete(options, {[Op.or]:attendees});
  }
};
