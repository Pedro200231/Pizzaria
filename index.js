const express = require("express");
const app = express();
const sequelize = require("./config/sequelize"); // A instância do Sequelize
require("./config/associations"); // Importa os relacionamentos

// Autenticação para teste
sequelize.authenticate().then(() => {
  console.log("Conexão bem-sucedida com o banco de dados!");

  // Sincroniza o banco de dados para garantir que os relacionamentos existam
  sequelize.sync();

  // Suas rotas, middlewares, etc.
  app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
});
