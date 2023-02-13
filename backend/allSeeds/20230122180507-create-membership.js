'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options objreturn
}
  module.exports = {

    up:async (queryInterface, Sequelize) =>{
    return queryInterface.createTable('Memberships', {
  

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
     
      groupId: {
        type: Sequelize.INTEGER,
       // allowNull:false,
        onDelete:"Cascade",
        references:{
            model:"Groups"
          }
        },
      userId: {
        type: Sequelize.INTEGER,
        onDelete:"Cascade",
        references:{
            model:"Users"
          }
      },
      status: {
        type: Sequelize.STRING,
        defaultValue:"organizer"
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
  down:async (queryInterface, Sequelize)=> {
    return queryInterface.dropTable('Memberships', options);
  }
};