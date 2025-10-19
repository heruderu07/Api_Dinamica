import express from "express";
import { createRecord, getRecords, getRecordById, deleteRecordById } from "@/controllers/controller.USD_BRL";

const usd_brlRouter = express.Router()

usd_brlRouter.post("/usd_brl", createRecord);
usd_brlRouter.get("/usd_brl", getRecords)
usd_brlRouter.get("/usd_brl/:id", getRecordById);
usd_brlRouter.delete("/usd_brl/:id", deleteRecordById);




export default usd_brlRouter