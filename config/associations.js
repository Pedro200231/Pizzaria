const User = require("../src/models/user"); // Ajuste o caminho conforme necessário
const Pizza = require("../src/models/pizza");

// Relacionamento entre User e Pizza
User.hasMany(Pizza, { foreignKey: "userId", as: "pizzas" }); // Um usuário pode ter várias pizzas
Pizza.belongsTo(User, { foreignKey: "userId", as: "user" }); // Uma pizza pertence a um usuário
