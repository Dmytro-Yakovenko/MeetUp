'use strict';
const {Op}=require("sequelize")
const events = [
  {
    groupId:2,
    description:" (For Hold Em & Omaha games, we do not use big/little blinds, but it is table stakes. It's a $20 buy-in to start and you're able to buy $20 stacks of chips. You can win a lot/lose a lot, based on how you play. No hard drinkers/drugs, 420 is fine)",
    capacity:10,
    name:"March 24",
    dateOfStart:"Friday, March 24, 2023 at 7:00 PM PDT",
    dateOfEnd:"March 24, 2023 at 11:30 PM PDT",
    locationId:1,
    attendees:7,
    price:60.00

  },
  {
    groupId:2,
    description:" (For Hold Em & Omaha games, we do not use big/little blinds, but it is table stakes. It's a $20 buy-in to start and you're able to buy $20 stacks of chips. You can win a lot/lose a lot, based on how you play. No hard drinkers/drugs, 420 is fine)",
    capacity:10,
    name:"April 22",
    dateOfStart:"Friday, April 21, 2023 at 7:00 PM PDT",
    dateOfEnd:"April 21, 2023 at 11:30 PM PDT",
    locationId:1,
    attendees:5,
    price:60.00

  },
  {
    groupId:1,
    description:"Our San Francisco Mother's evening group meets on the 4th Monday of the month from 7 p.m. to 9 p.m. at 65 Dorland Street. ",
    capacity:10,
    name:"Morning Mother's Group",
    dateOfStart:"Monday, January 23, 2023 at 7:00 PM PST",
    dateOfEnd:"Monday, January 23, 2023 at 9:00 PM PST",
    locationId:2,
    attendees:8,
    price:25.00

  },
  {
    groupId:1,
    description:"Our San Francisco Mother's evening group meets on the 4th Monday of the month from 7 p.m. to 9 p.m. at 65 Dorland Street. ",
    capacity:10,
    name:"Evening Mother's Group",
    dateOfStart:"Friday, April 21, 2023 at 7:00 PM PDT",
    dateOfEnd:"April 21, 2023 at 11:30 PM PDT",
    locationId:2,
    attendees:6,
    price:25.00

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
    await queryInterface.bulkInsert('Events', events, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     *  await queryInterface.bulkDelete('GroupImages', {[Op.or]:groups});
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Events', {[Op.or]:events});
  }
};
