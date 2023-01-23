'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Event.belongsToMany(models.User,{
        through:models.Attendees
      })

      // define association here
      Event.hasMany(models.EventImages, {
        foreignKey:'eventId',
        onDelete:'Cascade',
        hooks:true
      })


      Event.belongsTo(models.Location,{
        foreignKey:'locationId'
      })
      
        // Your code here
        Event.belongsTo(models.Group,{
          foreignKey:'groupId'
        })
      }
    
  }
  Event.init({
    groupId:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    description:{
      type:DataTypes.STRING,
      allowNull:false
    },
    capacity:{
      type:DataTypes.INTEGER,
      allowNull:false
    },

    name:{
      type:DataTypes.STRING,
      allowNull:false
    } ,
    dateOfStart:{
      type:DataTypes.DATE,
      allowNull:false
    } ,
    dateOfEnd:{
      type:DataTypes.DATE,
      allowNull:false
    } ,
    locationId:{
      type:DataTypes.INTEGER,
      allowNull:false
    } ,
    attendees:{
      type:DataTypes.INTEGER,
      allowNull:false
    } ,
    price: {
type:DataTypes.DOUBLE,
allowNull:false
    } 
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};