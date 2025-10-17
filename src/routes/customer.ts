import express from "express"
import {  getCustomerById, createCustomers } from "@/controllers/customers";

const customerRouter = express.Router()

customerRouter.post("/customers", createCustomers);
//customerRouter.get("/customers", getCustomers);
customerRouter.get("/customers/:id", getCustomerById);







export default customerRouter