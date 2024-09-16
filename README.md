## VERSAO NODE v18.19.1

# Mini CRUD de Usuários com Node.js e MongoDB

## Este é um projeto de CRUD (Create, Read, Update, Delete) para gerenciamento de usuários, implementado com Node.js, Express, MongoDB e JWT para autenticação. O projeto inclui documentação com Swagger para facilitar a visualização e teste das APIs.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no lado do servidor.
- **Express**: Framework para construir APIs RESTful.
- **MongoDB**: Banco de dados NoSQL utilizado para armazenar dados dos usuários.
- **Mongoose**: Biblioteca para modelar dados do MongoDB.
- **bcrypt**: Biblioteca para hashing de senhas.
- **jsonwebtoken (JWT)**: Biblioteca para criar e verificar tokens de autenticação.
- **express-validator**: Middleware para validação de dados em requisições.
- **Swagger**: Ferramenta para documentação e teste das APIs.

## Requisitos

- **Node.js**: Versão 18.19.1 (certifique-se de estar utilizando a versão recomendada para compatibilidade).

## Instalação

1. **Clone o Repositório**

  ## ```bash
  ## git clone https://github.com/samaelsimoes/crudUsuarioNode.git
  ## cd crudUsuarioNode
  ## node -v
  ## npm install
 
2. **Instalação mongodb**
    ## https://www.mongodb.com/try/download/community-kubernetes-operator
    ## configurar variaveis de ambiente no path, colocar o cominho ate a pasta bin no path do windows
    ## subir o mondo em um cmd mongod
    ## deixar aberto em outro terminal mongosh caso precise pegar alguns dados 

3. **Configure as Variáveis de Ambiente no projeto no arquivo .env**
  ## JWT_SECRET=SEU_SEGREDO_JWT 
  ## MONGO_URI=SEU_CONECT_STRING_MONGODB
  ## npm start

