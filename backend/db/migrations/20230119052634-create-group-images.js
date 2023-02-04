'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
   up: async (queryInterface, Sequelize) =>{
    return queryInterface.createTable('GroupImages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING
      },

      GroupId:{
        type: Sequelize.INTEGER,
      
          references: {
              model: 'Groups',
              key: 'id',
              onDelete: 'cascade'
          },
          
      
      },
      preview:{
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },


      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
   down: async(queryInterface, Sequelize) =>{
    return queryInterface.dropTable('GroupImages', options);
  }
};