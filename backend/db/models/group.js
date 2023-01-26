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

      Group.hasMany(models.Location, {
        foreignKey:'groupId',
        onDelete:'Cascade',
        hooks:true
      })

      
      Group.belongsToMany(models.User,{
        through:models.Membership
      })

      Group.hasMany(models.GroupImages, {
        foreignKey:'groupId',
        onDelete:'Cascade',
        hooks:true
      })

      Group.hasMany(models.Event, {
        foreignKey:'groupId',
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
    } 
    
  }, {
    sequelize,
    modelName: 'Group',

    defaultScope:{
      attributes:{
        include:[
          'id', 
          'organizerId',
          'name', 
          'about',
          'type', 
          'private',
           'city', 
           'state',
            'createdAt', 
            'updatedAt', 
        
            
        ]
      }
    },
    scopes:{
     
     
      groupWithImages(groupId){
        const {GroupImages} = require("../models")
              return {
                  where: { 
                      groupId
                  },
                  include: [ 
                      { model: GroupImages } 
                  ]
              }

          }
      }
       
    
  });
  return Group;
};