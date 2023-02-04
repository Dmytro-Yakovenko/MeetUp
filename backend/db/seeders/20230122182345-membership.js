'use strict';
const { Op } = require("sequelize")
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const membership = [
  {
    GroupId: 1,
    userId: 1,
    status: "co-host"
  },
  {
    GroupId: 1,
    userId: 2,
    status: "organizer"
  },
  {
    GroupId: 1,
    userId: 3,
    status: "member"
  },
  {
    GroupId: 2,
    userId: 4,
    status: "organizer"
  },
  {
    GroupId: 2,
    userId: 5,
    status: "co-host"
  },
  {
    GroupId: 2,
    userId: 6,
    status: "member"
  },
  {
    GroupId: 2,
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
    options.tableName = 'Memberships';

    return queryInterface.bulkInsert(options, membership,
    {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Memberships';
  return queryInterface.bulkDelete(options, {[Op.or]:membership},{});
}
}