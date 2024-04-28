# Projeto Pizzaria - Backend

## Introdução
Este projeto é uma aplicação web back-end para publicações de uma pizzaria. Ele permite que usuários cadastrem anúncios de pizzas, façam login, publiquem comentários e curtidas, entre outras funcionalidades.

## Pré-requisitos
- Node.js (versão 14 ou superior)
- MySQL (ou banco de dados compatível)
- Git (para clonar o repositório)

## Configuração do Banco de Dados
1. Crie um banco de dados no MySQL chamado `pizza_db`.
2. Crie um usuário no MySQL com permissões para acessar o banco de dados.
3. Atualize o arquivo `config/database.js` com as seguintes informações:
   - Nome do banco de dados
   - Usuário e senha
   - Host do banco de dados

## Instalação do Projeto
1. Clone o repositório:
   ```shell
   git clone [URL do repositório]
   cd [diretório do projeto]

## Instale as dependências do projeto:
 - npm install

## Configuração do Projeto
Verifique se o banco de dados foi criado e está acessível.
1. Se necessário, crie um arquivo .env para variáveis de ambiente como chaves secretas e configurações do banco de dados.
2. Verifique se o diretório uploads/ existe para armazenar imagens (crie-o se necessário).

## Execução da Aplicação
Inicie o servidor:
- node index.js
- A aplicação deve iniciar na porta 3000 por padrão.

## Endpoints Disponíveis
- Aqui está uma lista dos endpoints disponíveis e suas funções:

### Autenticação
- POST /auth/login: Realiza o login na aplicação. Requer email e password. Retorna um token JWT para autenticação.
- POST /auth/register: Registra um novo usuário. Requer name, email, e password.
  
### Usuários
- GET /users: Retorna uma lista de todos os usuários. Apenas administradores podem acessar.
- GET /users/:id: Retorna informações sobre um usuário específico. Apenas administradores podem acessar.
- PUT /users/me: Permite que um usuário autenticado atualize seu próprio nome e senha.
- PUT /users/:id: Permite que um administrador atualize informações de um usuário específico.
- DELETE /users/:id: Permite que um administrador exclua um usuário específico.
  
### Anúncios de Pizza
- POST /pizzaAds: Cria um novo anúncio de pizza. Requer autenticação. Deve incluir name, description, ingredients, price, e uma imagem opcional.
- GET /pizzaAds: Retorna uma lista de todos os anúncios de pizza.
- GET /pizzaAds?ingredient=INGREDIENTE: Filtra os anúncios de pizza por ingrediente.
- GET /pizzaAds?maxPrice=PRECO: Filtra os anúncios de pizza por preço máximo.
### Comentários e Curtidas
- POST /pizzaAds/:pizzaId/comments: Adiciona um comentário a um anúncio de pizza. Requer text.
- GET /pizzaAds/:pizzaId/comments: Lista todos os comentários para um anúncio de pizza.
- POST /pizzaAds/:pizzaId/like: Curte um anúncio de pizza.
