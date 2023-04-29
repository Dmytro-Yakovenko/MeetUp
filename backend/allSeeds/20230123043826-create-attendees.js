"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  up:async(queryInterface, Sequelize) =>{
    return queryInterface.createTable("Attendees", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      eventId: {
        type: Sequelize.INTEGER,
        allowNull:false,
    
        },
      userId: {
        type: Sequelize.INTEGER,
      
      },
      status:{
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
    },options);
  },
  down:async (queryInterface, Sequelize)=>{
    await queryInterface.dropTable("Attendees", options);
  }
};