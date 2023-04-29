"use strict";
const { Op } = require("sequelize")
const {User, Group}= require("../models")
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const membership = [
  {
    
      user: { firstName: "Dmytro", lastName: "Yakovenko" },
      group: { name: "San Francisco Mother's Group" },
    
    status: "co-host"
  },

  {
    
    user: { firstName: "Sergey", lastName: "Shiryaev" },
    group: { name: "SF Gay Men's Poker Group"},
  
  status: "co-host"
},
  // {
  //   groupId: 1,
  //   userId: 2,
  //   status: "organizer"
  // },
  // {
  //   groupId: 1,
  //   userId: 3,
  //   status: "member"
  // },
  // {
  //   groupId: 2,
  //   userId: 4,
  //   status: "organizer"
  // },
  // {
  //   groupId: 2,
  //   userId: 5,
  //   status: "co-host"
  // },
  // {
  //   groupId: 2,
  //   userId: 6,
  //   status: "member"
  // },
  // {
  //   groupId: 2,
  //   userId: 2,
  //   status: "pending"
  // },
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
    for(let i = 0; i < membership.length; i++) {
      const data = membership[i];
      const user =  await User.findOne({ where: data.user });
      const group = await Group.findOne({ where: { [Op.or]: data.group } });
      await user.addGroup(group);
    }

    options.tableName = "Memberships";

    return queryInterface.bulkInsert(options, membership,
    {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete("People", null, {});
     */
    for(let i = 0; i < membership.length; i++) {
      const data = membership[i];
      const user =  await User.findOne({ where: data.user });
      const group = await Group.findOne({ where: { [Op.or]: data.group } });
      await user.removeGroup(group);
    }



    options.tableName = "Memberships";
  return queryInterface.bulkDelete(options, {[Op.or]:membership},{});
}
}