import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createRecord(req: Request, res: Response){
const {create_date, high, low, volume} =req.body
try {
    const newRecord = await db.uSD_BRL.create({
        data: {
            create_date, 
            high: parseFloat(high),
            low: parseFloat(low),
            volume: parseFloat(volume)
        }
    })
    return res.status(201).json(newRecord)
} catch (error) {
    console.log(error);
}
}

export async function getRecords(req: Request, res: Response) {
    try {
        const records = await db.uSD_BRL.findMany({
            orderBy:{
                createdAt: "desc"
            }
        })
        return res.status(200).json(records)
    } catch (error) {
        console.log(error)
    }    
}

export async function getRecordById(req: Request, res: Response) {
    const  id  = Number(req.params.id);
    try {
        const records = await db.uSD_BRL.findUnique({
            where:{
            id
            }
        });
        return res.status(200).json(records);
    } catch (error) {
        console.log(error)
    }
}

export async function deleteRecordById(req: Request, res: Response) {
    const id = Number(req.params.id);
    try{
        const records = await db.uSD_BRL.delete({
            where:{
                id
            }
        });
        return res.status(200).json(`Record of  ${records.create_date} deleted.`)
    } catch (error) {
        console.log(error)
    }

}