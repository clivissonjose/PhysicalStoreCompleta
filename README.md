README.md

# Projeto NestJS - Gerenciamento de Lojas

Este projeto é uma API desenvolvida em NestJS para gerenciar lojas, calcular distâncias entre CEPs e realizar outras funcionalidades relacionadas.

## Pré-requisitos

Certifique-se de ter os seguintes itens instalados no seu ambiente:

- [Node.js](https://nodejs.org/) (versão 16 ou superior recomendada)
- [NestJS CLI](https://docs.nestjs.com/cli/overview)
- [MongoDB](https://www.mongodb.com/)

---

## Configuração

1. Clone este repositório:

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
Instale as dependências:

npm install

Configure as variáveis de ambiente:
Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis:

MONGO_URI= # URL de conexão com o MongoDB
GOOGLE_API_KEY= # Chave de API do Google Maps
Exemplo:


MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/meu-banco
GOOGLE_API_KEY=AIzaSyA...sua-chave-aqui

Para rodar o projeto em ambiente de desenvolvimento:

npm run start:dev

A API estará disponível em http://localhost:3000.
