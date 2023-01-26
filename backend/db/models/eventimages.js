'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EventImages.belongsTo(models.Event,{
        foreignKey:'eventId'
      })
    }
  }
  EventImages.init({
    eventId:{
      type:DataTypes.INTEGER,
      allowNull:false
    } ,
    title:{
      type:DataTypes.STRING,
      allowNull:false
    } ,
    url:{
      type:DataTypes.STRING,
      allowNull:false

    } 
  }, {
    sequelize,
    modelName: 'EventImages',
  });
  return EventImages;
};