'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  up:async (queryInterface, Sequelize)=> {
    return queryInterface.createTable('Locations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.FLOAT
      },
      longtitude: {
        type: Sequelize.FLOAT
      },
      groupId:{
        type: Sequelize.INTEGER,
            references: {
                model: 'Groups',
                key: 'id',
            },
            onDelete: 'cascade'
        
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE, defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
      }
    },options);
  },
  down:async (queryInterface, Sequelize)=>{
    return  queryInterface.dropTable('Locations', options);
    
  }
};