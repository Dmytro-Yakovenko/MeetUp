"use strict";

const { Op } = require("sequelize")
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const data = [
  {
 
    url: "https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674224420/istockphoto-1370858710-612x612_mfystv.jpg",
    groupId: 1,
    preview: true

  },
  {
   
    url: "https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674224426/istockphoto-1184832334-612x612_eyzmsf.jpg",
    groupId: 1,
    preview: false
  },
  {
    
    url: "https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674224433/istockphoto-1386881204-612x612_ccu2pw.jpg",
    groupId: 1,
    preview: false
  },
  {
   
    url: "https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674223774/tyrell-james-3h8KD8l_Q0A-unsplash_bnswa7.jpg",
    groupId: 2,
    preview: true
  },
  {
   
    url: "https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674223781/chris-liverani-MJX7-BAdkt0-unsplash_wxwuu0.jpg",
    groupId: 2,
    preview: true
  },
  {
   
    url: "https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674223792/amanda-jones-P787-xixGio-unsplash_iheiqo.jpg",
    groupId: 2,
    preview: true
  },
  {
   
    url: "https://res.cloudinary.com/dr1ekjmf4/image/upload/v1683121834/pokerEventImages/pexels-ngoc-binh-ha-12187693_l915tw.jpg",
    groupId: 3,
    preview: true
  },
  {
   
    url: "https://res.cloudinary.com/dr1ekjmf4/image/upload/v1683121785/pokerEventImages/pexels-alteredsnaps-12173178_v65piq.jpg",
    groupId: 3,
    preview: true
  },
  {
   
    url: "https://res.cloudinary.com/dr1ekjmf4/image/upload/v1683122041/pokerEventImages/pexels-rodnae-productions-6412829_bceqxy.jpg",
    groupId: 3,
    preview: true
  },
  {
   
    url: "https://res.cloudinary.com/dr1ekjmf4/image/upload/v1678422933/pokerEventImages/pexels-pixabay-208745_uxmaqe.jpg",
    groupId: 4,
    preview: true
  },
  {
   
    url: "https://res.cloudinary.com/dr1ekjmf4/image/upload/v1683923833/pokerEventImages/pexels-pixabay-533881_hlkywm.jpg",
    groupId: 5,
    preview: true
  },
  {
   
    url: "https://res.cloudinary.com/dr1ekjmf4/image/upload/v1683924151/pokerEventImages/Dmytro_dragons_game_of_thrones_8f67536f-679c-4ec8-ba49-60f29fc124f7_d2vkdj.png",
    groupId: 6,
    preview: true
  }

]
/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert("People", [{
     *   name: "John Doe",
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = "GroupImages";
    return queryInterface.bulkInsert(options, data,
      {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete("People", null, {});
     */
    options.tableName = "GroupImages";
    return queryInterface.bulkDelete(options, { [Op.or]: groups }, {});
  }
};
