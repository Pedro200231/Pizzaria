const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, // Instância do Sequelize
    modelName: "User",
    tableName: "users", // Nome da tabela
    timestamps: true, // Se desejar adicionar createdAt e updatedAt
  }
);

module.exports = User;
