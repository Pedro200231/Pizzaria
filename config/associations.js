const User = require("../src/models/user"); 
const Pizza = require("../src/models/pizza");

User.hasMany(Pizza, { foreignKey: "userId", as: "pizzas" }); 
Pizza.belongsTo(User, { foreignKey: "userId", as: "user" }); 
