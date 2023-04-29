"use strict";

let options = {};
options.tableName= "Users"
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable("users", { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn(options, "firstName", { type: Sequelize.STRING, allowNull:true });
    await queryInterface.addColumn(options, "lastName", { type: Sequelize.STRING, allowNull:true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable("users");
     */
    await queryInterface.removeColumn(options, "firstName", { /* query options */ });

    await queryInterface.removeColumn(options, "lastName", { /* query options */ });
  }
};
