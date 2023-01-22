'use strict';
const {Op}=require("sequelize")

const location = [
  {
    city:"San Francisco",
    state:"California",
    address:"355 London Street",
    latitude:37.723350,
    longtitude:-122.434490
  },
  {
    city:"San Francisco",
    state:"California",
    address:"55 Mission Street",
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

    await queryInterface.bulkInsert('Locations', location,
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
    await queryInterface.bulkDelete('Locations', {[Op.or]:location});
  }
};
