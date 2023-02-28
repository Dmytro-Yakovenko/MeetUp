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
      Membership.belongsTo(models.User, {foreignKey: "memberId"})
      Membership.belongsTo(models.Group, {foreignKey: "groupId"})
    }
  }
  Membership.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model: "Groups"},
      onDelete: "CASCADE"
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model: "Users"},
      onDelete: "CASCADE"
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "non-member"
    },
  }, {
    sequelize,
    modelName: 'Membership',
  });

  Membership.addScope("defaultScope", {
    attributes: {
      exclude: ["createdAt", "updatedAt"]
    }
  })

  Membership.addScope("submission", {
    attributes: {
      exclude: ["id", "groupId", "createdAt", "updatedAt"]
    }
  })
  return Membership;
};