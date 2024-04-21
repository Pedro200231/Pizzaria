const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/sequelize"); // A instância do Sequelize
require("./config/associations"); // Importa os relacionamentos

const app = express();

// Middleware para processar JSON nos requests
app.use(bodyParser.json());

// Rotas de Autenticação
const authRoutes = require("./src/routes/authRoutes");

// Middleware para autenticação JWT (para rotas protegidas)
const authMiddleware = require("./src/middlewares/auth");

// Use as rotas de autenticação
app.use("/auth", authRoutes);

const userRoutes = require("./src/routes/userRoutes"); // Adicionar novo arquivo de rotas

// Use as novas rotas
app.use("/users", userRoutes); // Rota para operações com usuários

// Teste a conexão com o banco de dados e sincronize
sequelize.authenticate()
  .then(() => {
    console.log("Conexão bem-sucedida com o banco de dados!");

    // Sincroniza o banco de dados para garantir que as tabelas existam
    sequelize.sync();

    // Rota para teste, protegida pelo middleware de autenticação
    app.get("/protected", authMiddleware, (req, res) => {
      res.json({ message: "Você está autenticado!", user: req.user });
    });

    // Inicializa o servidor
    app.listen(3000, () => {
      console.log("Servidor rodando na porta 3000");
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
  });
