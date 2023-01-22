'use strict';
const {Op}=require("sequelize")

const groups = [
  { name: "San Francisco Mother's Group",
  organizerId:1,
  about:"In person gatherings for women raising the next generation. Open to single moms, married moms, mothers through adoption and fostering, from pregnancy through high school. Every mom is welcome here.",
  type:"inPerson",
  private:false,
  city:"San Francisco",
  state:"California",
  numMembers:28,
  previewImage:"https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674141915/istockphoto-1398323118-2048x2048_jqlaxl.jpg"

},
{ name: "SF Gay Men's Poker Group",
organizerId:2,
about:"Hello. I have a bi-weekly Gay Men's Poker Group for 20+ years (All are welcome-we've had lesbians/straight guys play too) and we're looking for a few others to join us.",
type:"inPerson",
private:false,
city:"San Francisco",
state:"California",
numMembers:28,
previewImage:"https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674187985/mariya-georgieva-0O6Fv3Ff_XI-unsplash_alivz5.jpg"

},

];
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
    await queryInterface.bulkInsert('Groups',
        groups,{});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Groups', {[Op.or]:groups});
  }
};
