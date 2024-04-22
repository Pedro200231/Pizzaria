// models/pizza.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const User = require("./user"); // Certifique-se de importar o modelo User

class Pizza extends Model {}

Pizza.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 100],
          msg: "O nome deve ter entre 3 e 100 caracteres.",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ingredients: {
      type: DataTypes.TEXT, // Use TEXT para maior compatibilidade
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("ingredients");
        try {
          return JSON.parse(rawValue); // Tenta parsear como JSON
        } catch (e) {
          return rawValue ? rawValue.split(",") : []; // Se não for JSON, divide por vírgula
        }
      },
      set(value) {
        if (Array.isArray(value)) {
          this.setDataValue("ingredients", JSON.stringify(value)); // Salva como JSON
        } else {
          this.setDataValue("ingredients", value); // Se já for texto, apenas salva
        }
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "O preço não pode ser negativo.",
        },
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Pizza",
    tableName: "pizzas",
    timestamps: true,
  }
);

Pizza.belongsTo(User, {
  foreignKey: "userId",
  as: "publisher",
  onDelete: "CASCADE",
});

module.exports = Pizza;
