'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recruitment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Recruitment.init({
    name: DataTypes.TEXT,
    owner: DataTypes.TEXT,
    discription: DataTypes.TEXT,
    member_cnt: DataTypes.INTEGER,
    password: DataTypes.TEXT,
    deadline: DataTypes.DATE,
    IPaddr: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Recruitment',
  });
  return Recruitment;
};