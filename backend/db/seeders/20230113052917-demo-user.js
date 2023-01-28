'use strict';
const bcrypt = require("bcryptjs");


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {

        firstName:"Dmytro",
        lastName:"Yakovenko",
        email: 'yakovenko@gmail.com',
        username: 'fakeUser',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName:"Sergey",
        lastName:"Shiryaev",
        email: 'shiryaev@gmail.com',

  
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {

        firstName:"Alex",
        lastName:"Wright",
        email: 'wright@gmail.com',

      
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName:"Nadezhda",
        lastName:"Epina",
        email: 'epina@gmail.com',
        username: 'realUser',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName:"Gaby",
        lastName:"Lunkes",
        email: 'lunkes@gmail.com',
        username: 'realUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName:"Hanan",
        lastName:"Jomaa",
        email: 'jomaa@gmail.com',
        username: 'realUser2',
        hashedPassword: bcrypt.hashSync('password2')
      }

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', ] }
    }, {});
  }
};
