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

export async function getCustomers(req: Request, res: Response) {
    try {
        const customers = await db.customer.findMany({
            orderBy:{
                createdAt: "desc"
            }
        })
        return res.status(200).json(customers)
    } catch (error) {
        console.log(error)
    }    
}

export async function getCustomerById(req: Request, res: Response) {
    const  id  = Number(req.params.id);
    try {
        const customer = await db.customer.findUnique({
            where:{
            id
            }
        });
        return res.status(200).json(customer);
    } catch (error) {
        console.log(error)
    }
}

export async function deleteCustomerById(req: Request, res: Response) {
    const id = Number(req.params.id);
    try{
        const customer = await db.customer.delete({
            where:{
                id
            }
        });
        return res.status(200).json(`Customer ${customer.name} deleted.`)
    } catch (error) {
        console.log(error)
    }

}