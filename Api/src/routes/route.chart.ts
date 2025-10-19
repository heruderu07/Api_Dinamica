import express from "express";
import { getChartData } from "@/controllers/controller.chart" ;


const chartRouter = express.Router()

chartRouter.get("/chart/:chartType", getChartData);

export default chartRouter;