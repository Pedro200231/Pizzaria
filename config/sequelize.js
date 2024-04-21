const { Sequelize } = require("sequelize");
const config = require("./database"); // Importando o arquivo de configuração

// Criar a instância do Sequelize usando as configurações
const sequelize = new Sequelize(
  config.development.database, // Nome do banco de dados
  config.development.username, // Usuário
  config.development.password, // Senha
  {
    host: config.development.host,
    dialect: config.development.dialect,
  }
);

module.exports = sequelize; // Exportar a instância para uso em outros arquivos
