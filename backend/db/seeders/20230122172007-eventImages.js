"use strict";
const {Op}=require("sequelize")
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const eventImages = [
  {
    eventId:1,
    
    url:"https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674409504/pokerEventImages/istockphoto-914839102-612x612_csw0gr.jpg",
    preview:true
  },
  {
    eventId:1,
   
    url:"https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674409058/pokerEventImages/tyrell-james-3h8KD8l_Q0A-unsplash_ukummt.jpg",
    preview:true
  },
  {
    eventId:2,
   
    url:"https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674409044/pokerEventImages/istockphoto-505800420-612x612_qd2kfk.jpg",
    preview:true
  },
  {
    eventId:2,
   
    url:"https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674409511/pokerEventImages/istockphoto-915607656-612x612_g0vrtl.jpg",
    preview:true
  },
  {
    eventId:3,
    
    url:"https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674409566/pokerEventImages/istockphoto-162329443-170x170_amr36n.jpg",
    preview:true
  },
  {
    eventId:3,
    
    url:"https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674409511/pokerEventImages/istockphoto-915607656-612x612_g0vrtl.jpg",
    preview:true
  },
  {
    eventId:4,
    
    url:"https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674409504/pokerEventImages/istockphoto-914839102-612x612_csw0gr.jpg",
    preview:true
  },
  {
    eventId:4,
    
    url:"https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674409494/pokerEventImages/istockphoto-508470473-612x612_o2wijc.jpg",
    preview:true
  }
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


    options.tableName = "EventImages";
    return  queryInterface.bulkInsert(options, eventImages,
    {});

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete("People", null, {});
     */
    options.tableName = "EventImages";
    return queryInterface.bulkDelete(options, {[Op.or]:eventImages},{});
  }
};
