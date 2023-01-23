'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      
    }
  }
  Membership.init({
    allGroupsId:{
      type:DataTypes.INTEGER,
      allowNull:false
    } ,
    userId:{
      type:DataTypes.INTEGER,
      allowNull:false
    } ,
    status:{
      type:DataTypes.BOOLEAN
    } 
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};