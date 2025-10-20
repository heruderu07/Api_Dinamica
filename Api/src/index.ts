import express from "express";
import usd_brlRouter from "@/routes/route.USD_BRL";
import chartRouter from "@/routes/route.chart";

import swaggerUi from "swagger-ui-express";
const YAML = require("yamljs");
import path from "path";

require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8000;
app.use(express.json());

// 🟡 Carrega o arquivo swagger.yaml (ajuste conforme localização real)
const swaggerDocument = YAML.load(path.join(__dirname, "./docs/swagger.yaml"));

// 🟢 Rota para a documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 🔵 Suas rotas
app.use("/api/v1", usd_brlRouter, chartRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

export default app;
