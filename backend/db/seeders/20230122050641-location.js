'use strict';
const {Op}=require("sequelize")
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const location = [
  {
    city:"San Francisco",
    state:"California",
    address:"355 London Street",
    GroupId:2,
    latitude:37.723350,
    longtitude:-122.434490
  },
  {
    city:"San Francisco",
    state:"California",
    address:"55 Mission Street",
    GroupId:1,
    latitude:37.723350,
    longtitude:-122.434490
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

    options.tableName = 'Locations';

    return queryInterface.bulkInsert(options, location,
       {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     * 
     */
    options.tableName = 'Locations';
    return  queryInterface.bulkDelete(options, {[Op.or]:location},{});
  }
};
