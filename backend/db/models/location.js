'use strict';


const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Location.belongsTo(models.Group,{
        foreignKey:'GroupId'
      })


      Location.hasOne(models.Event,{
        foreignKey:'locationId'
      })
    }
  }
  Location.init({
    city:{
      type:DataTypes.STRING,
      allowNull:false
    } ,
    state:{
      type:DataTypes.STRING,
      allowNull:false
    },
    address:{
      type:DataTypes.STRING,
      allowNull:false
    } ,
    latitude:{
      type:DataTypes.FLOAT,
      allowNull:false
    } ,
    longtitude:{
      type:DataTypes.FLOAT,
      allowNull:false
    } ,
    GroupId:{
      type:DataTypes.INTEGER,
      allowNull:false
    } 
  }, {
    sequelize,
    modelName: 'Location',
  });
  return Location;
};