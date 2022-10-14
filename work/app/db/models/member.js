'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Member.init({
    recuit_id: DataTypes.INTEGER,
    name: DataTypes.TEXT,
    discription: DataTypes.TEXT,
    IPaddr: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Member',
  });
  return Member;
};