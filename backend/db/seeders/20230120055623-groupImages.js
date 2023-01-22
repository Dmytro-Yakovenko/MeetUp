'use strict';

const {Op}=require("sequelize")
const data = [
  {
title:"mothers1",
url:"https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674224420/istockphoto-1370858710-612x612_mfystv.jpg",
allGroupId:1
},
{
  title:"mothers2",
  url:"https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674224426/istockphoto-1184832334-612x612_eyzmsf.jpg",
  allGroupId:1
  },
  {
    title:"mothers3",
    url:"https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674224433/istockphoto-1386881204-612x612_ccu2pw.jpg",
    allGroupId:1
    },
    {
      title:"poker1",
      url:"https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674223774/tyrell-james-3h8KD8l_Q0A-unsplash_bnswa7.jpg",
      allGroupId:2
      }, 
      {
        title:"poker2",
        url:"https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674223781/chris-liverani-MJX7-BAdkt0-unsplash_wxwuu0.jpg",
        allGroupId:2
        }, 
        {
          title:"poker3",
          url:"https://res.cloudinary.com/dr1ekjmf4/image/upload/v1674223792/amanda-jones-P787-xixGio-unsplash_iheiqo.jpg",
          allGroupId:2
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
    await queryInterface.bulkInsert('GroupImages', data,
      {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('GroupImages', {[Op.or]:groups});
  }
};