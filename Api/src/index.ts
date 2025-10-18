import express from "express";
import customerRouter from "./routes/route_customer";
import usd_brlRouter from "./routes/route_USD_BRL";
import chartRouter from "./routes/route.chart";
 
require("dotenv").config(); 
const cors = require("cors"); 
const app = express();

app.use(cors());

const PORT = process.env.PORT || 8000;
 
app.use(express.json());
 
app.listen(PORT, () => {
  
  console.log(`Server is running on http://localhost:${PORT}`); 
});

app.use("/api/v1", customerRouter, usd_brlRouter, chartRouter)