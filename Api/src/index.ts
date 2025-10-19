import express from "express";
import usd_brlRouter from "./routes/route.USD_BRL";
import chartRouter from "./routes/route.chart";
 
require("dotenv").config(); 
const cors = require("cors"); 
const app = express();

app.use(cors());

const PORT = process.env.PORT || 8000;
 
app.use(express.json());
 
app.use("/api/v1", usd_brlRouter, chartRouter)

app.listen(PORT, () => {
  
  console.log(`Server is running on http://localhost:${PORT}`); 
});


export default app;