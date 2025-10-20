# API Dinâmica - USD_BRL

Repositório para o backend da API que realiza CRUD do modelo USD_BRL e fornece dados para gráficos.

## Tecnologias

- Node.js
- TypeScript
- Express
- Prisma ORM
- MySQL (via mysql2)
- Swagger (documentação API)
- Jest (testes)
- ts-node-dev (desenvolvimento)
- dotenv (variáveis de ambiente)

## Scripts

| Script         | Descrição                                |
| -------------- | -------------------------------------- |
| `npm run dev`  | Executa a API em modo desenvolvimento   |
| `npm test`     | Executa os testes com Jest              |

## Como rodar a API localmente

1. Clone o repositório e acesse a pasta da API:
   ```bash
   git clone https://github.com/heruderu07/Api_Dinamica.git
   cd Api_Dinamica/api

2. Instale as dependências:
   ```bash
   npm install

3. Configure seu banco de dados e ajuste o arquivo .env.example alterando seu nome para .env e fornecendo as variáveis de ambiente

4. Gere o Prisma Client:
   ```bash
   npx prisma generate

5. Execute a API em modo de desenvolvimento:
   ```bash
   npm run dev

6. Acesse a documentação do Swagger da API:
   ```bash
   http://localhost:8000/api-docs

## Estrutura da API
- Endpoints para CRUD do modelo USD_BRL(/usd_brl)
- Endpoints para dados de gráficos (/chart/{chartType})
- Validações e tratamentos de erros com respostas claras

## Testes
- Os testes são feitos com Jest
- Para rodar os testes:
   ```bash
   npm test