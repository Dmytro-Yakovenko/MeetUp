'use strict';
const {Op}=require("sequelize")
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const events = [
  {
    groupId:2,
    description:" (For Hold Em & Omaha games, we do not use big/little blinds, but it is table stakes. It's a $20 buy-in to start and you're able to buy $20 stacks of chips. You can win a lot/lose a lot, based on how you play. No hard drinkers/drugs, 420 is fine)",
    capacity:10,
    name:"March 24",
   startDate:"2023-03-24 19:00:00",
    endDate:"2023-03-24 23:00:00",
    locationId:1,
    price:60.00,
   
  },
  {
    groupId:2,
    description:" (For Hold Em & Omaha games, we do not use big/little blinds, but it is table stakes. It's a $20 buy-in to start and you're able to buy $20 stacks of chips. You can win a lot/lose a lot, based on how you play. No hard drinkers/drugs, 420 is fine)",
    capacity:10,
    name:"April 22",
   startDate:"2023-04-21 19:00:00",
    endDate: "2023-04-21 23:00:00",
    locationId:1,
    price:60.00,
   
  },
  {
    groupId:1,
    description:"Our San Francisco Mother's evening group meets on the 4th Monday of the month from 7 p.m. to 9 p.m. at 65 Dorland Street. ",
    capacity:10,
    name:"Morning Mother's Group",
   startDate:"2023-01-23 19:00:00" ,
    endDate:"2023-01-23 21:00:00"  ,
    locationId:2,
    price:25.00,
  
   
  },
  {
    groupId:1,
    description:"Our San Francisco Mother's evening group meets on the 4th Monday of the month from 7 p.m. to 9 p.m. at 65 Dorland Street. ",
    capacity:10,
    name:"Evening Mother's Group",
   startDate:"2023-04-21 11:30:00",
    endDate:"2023-04-21 19:00:00",
    locationId:2,
    price:25.00,
   

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
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, events, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     *  await queryInterface.bulkDelete('GroupImages', {[Op.or]:groups});
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Events';
  await queryInterface.bulkDelete(options, {[Op.or]:events},{});
  }
};
