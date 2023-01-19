'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
          // Your code here
          GroupImages.belongsTo(models.Group,{
            foreignKey:'allGroupsId'
          })
    }
  }
  GroupImages.init({
    title:{
      type:DataTypes.STRING,
      allowNull:false
    } ,
    url: {
      type:DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'GroupImages',
  });
  return GroupImages;
};