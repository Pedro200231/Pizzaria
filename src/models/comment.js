const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const Pizza = require("./pizza");
const User = require("./user");

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    pizzaId: {
      type: DataTypes.INTEGER,
      references: {
        model: "pizzas",
        key: "id",
      },
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Comment",
    tableName: "comments",
    timestamps: true,
  }
);

Pizza.hasMany(Comment, { foreignKey: "pizzaId" });
Comment.belongsTo(Pizza, { foreignKey: "pizzaId" });

User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });

module.exports = Comment;
