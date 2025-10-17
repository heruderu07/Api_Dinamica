import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createCustomers(req: Request, res: Response){
const {name, email, gender, country, plan} =req.body
try {
    const newCustomer = await db.customer.create({
        data: {
            name, 
            email,
            gender,
            country,
            plan
        }
    })
    return res.status(201).json(newCustomer)
} catch (error) {
    console.log(error);
}

}

export async function getCustomerById(req: Request, res: Response) {
    
}