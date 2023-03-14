"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  up:async (queryInterface, Sequelize) =>{
    return queryInterface.createTable("Groups", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      organizerId: {
        type: Sequelize.INTEGER,
     
          references: {
              model: "Users",
              key: "id",
          },
          onDelete: "cascade"
      
      },
      about: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      private: {
        type: Sequelize.BOOLEAN
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
     
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal("CURRENT_TIMESTAMP")
      }
    }, options);
  },
  down:async (queryInterface, Sequelize) =>{
    await queryInterface.dropTable("Groups", options);
  }
};