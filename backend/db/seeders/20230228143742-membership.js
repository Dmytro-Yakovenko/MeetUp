'use strict';
const bcrypt = require("bcryptjs");
const {User} = require("../models")

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        memberId: 1,
        status: "member"
      },
      {
        groupId: 2,
        memberId: 1,
        status: "member"
      },
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    ])},

    async down (queryInterface, Sequelize) {
      options.tableName = 'Memberships';
      const Op = Sequelize.Op;
      return queryInterface.bulkDelete(options, {});
    }
};
