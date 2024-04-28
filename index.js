const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/sequelize"); 
require("./config/associations"); 

const app = express();

app.use(bodyParser.json());

const authRoutes = require("./src/routes/authRoutes");

const authMiddleware = require("./src/middlewares/auth");

app.use("/auth", authRoutes);

const userRoutes = require("./src/routes/userRoutes"); 

app.use("/users", userRoutes); 

const pizzaRoutes = require('./src/routes/pizzaRoutes'); 

app.use('/pizza', pizzaRoutes); 

sequelize.authenticate()
  .then(() => {
    console.log("Conexão bem-sucedida com o banco de dados!");

    sequelize.sync();

    app.get("/protected", authMiddleware, (req, res) => {
      res.json({ message: "Você está autenticado!", user: req.user });
    });

    app.listen(3000, () => {
      console.log("Servidor rodando na porta 3000");
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
  });
