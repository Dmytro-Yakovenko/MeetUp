"use strict";
const {Op}=require("sequelize")
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const groups = [
  { name: "San Francisco Mother's Group",
  organizerId:4,
  about:"In person gatherings for women raising the next generation. Open to single moms, married moms, mothers through adoption and fostering, from pregnancy through high school. Every mom is welcome here.",
  type:"inPerson",
  private:false,
  city:"San Francisco",
  state:"California",
  

},
{ name: "SF Gay Men's Poker Group",
organizerId:2,
about:"Hello. I have a bi-weekly Gay Men's Poker Group for 20+ years (All are welcome-we've had lesbians/straight guys play too) and we're looking for a few others to join us.",
type:"inPerson",
private:false,
city:"San Francisco",
state:"California",

},
{ name: "Boba Buddies SF🧋",
organizerId:1,
about:"Are you a fan of boba and wholesome fun? Let's meet up and grab boba together! Growing up in SF I would always go to various boba places in the city and play boardgames with my friends. It was always very fun, and helped flourish a lot of my current friendships. I’m hoping to recreate that same feeling with this group! I'd love to get together to possibly meet at boba place every other week while meeting new people!",
type:"inPerson",
private:false,
city:"San Francisco",
state:"California",

},

];
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
    options.tableName = "Groups";
    return queryInterface.bulkInsert(options,
        groups,{});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete("People", null, {});
     */
    options.tableName = "Groups";
    return queryInterface.bulkDelete(options, {[Op.or]:groups},{});
  }
};
