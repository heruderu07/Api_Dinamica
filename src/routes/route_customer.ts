import express from "express"
import {  getCustomers, getCustomerById, createCustomers, deleteCustomerById } from "@/controllers/controller_customers";

const customerRouter = express.Router()

customerRouter.post("/customers", createCustomers);
customerRouter.get("/customers", getCustomers);
customerRouter.get("/customers/:id", getCustomerById);
customerRouter.delete("/customers/:id", deleteCustomerById);






export default customerRouter