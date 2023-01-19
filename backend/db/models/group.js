'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Group.hasMany(models.GroupImages, {
        foreignKey:'allGroupsId',
        onDelete:'Cascade',
        hooks:true
      })


      Group.belongsTo(models.User,{
        foreignKey:'organizerId'
      })
    }
  }
  Group.init({
    name:{
     type: DataTypes.STRING,
     allowNull:false
    } ,
    
    organizerId:{
      type:DataTypes.INTEGER,
      allowNull:false
    } ,
    about:{
      type: DataTypes.STRING,
     allowNull:false 
    },
    type:{
      type: DataTypes.STRING,
      allowNull:false
    } ,
    private:{
      type: DataTypes.BOOLEAN,
      allowNull:true
    } ,
    city:{
      type: DataTypes.STRING,
      allowNull:false
    } ,

    state:{
      type: DataTypes.STRING,
      allowNull:false
    } ,
    numMembers:{
      type: DataTypes.STRING,
      allowNull:false
    },
    previewImage:{
      type: DataTypes.STRING,
      allowNull:false
    } 
  }, {
    sequelize,
    modelName: 'Group',


  });
  return Group;
};