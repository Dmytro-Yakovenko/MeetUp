"use strict";
const { Op } = require("sequelize")
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const attendees =[
  {
    eventId:1,
    userId:1,
    status:"member"
  },
  {
    eventId:1,
    userId:2,
    status:"pending"
  },
  {
    eventId:1,
    userId:3,
    status:"organizer"
  },
  {
    eventId:2,
    userId:4,
    status:"attending"
  },
  {
    eventId:2,
    userId:5,
    status:"organizer"
  },
  {
    eventId:2,
    userId:6,
    status:"pending"
  },

]

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert("People", [{
     *   name: "John Doe",
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = "Attendees";
    return queryInterface.bulkInsert(options, attendees,
    {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete("People", null, {});
     */
    options.tableName = "Attendees";
    return queryInterface.bulkDelete(options, {[Op.or]:attendees},{});
  }
};
