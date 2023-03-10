"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
          // Your code here
          GroupImage.belongsTo(models.Group,{

            foreignKey:"groupId"

          })
    }
  }
  GroupImage.init({
  
    url: {
      type:DataTypes.STRING,
      allowNull:false

    },
    groupId:{
      type: DataTypes.INTEGER,
      allowNull:false,
      
    },
    preview:{
      type: DataTypes.BOOLEAN,
      defaultValue:false
    }


  }, {
    sequelize,
    modelName: "GroupImage",
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt", "groupId"]
      }
    }
  });
  GroupImage.addScope("exclusion", {
    attributes: {
      exclude: [ "createdAt", "updatedAt"]
    }
  })
  return GroupImage;
};