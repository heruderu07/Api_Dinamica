import { db } from "@/db/db";
import { Request, Response } from "express";

export async function getChartData(req: Request, res: Response) {
    const { chartType } = req.params;
    const {  startDate, endDate } = req.query;

    try {
        const dataRecords = await db.uSD_BRL.findMany({
            where: {
            create_date: {
                gte: new Date(startDate as string),
                lte: new Date(endDate as string),
            },
        },
        orderBy:{
            create_date: "asc"
        },
        });

        let formatedDataRecords;

        switch (chartType) {
            case "line":
            case "bar":

            formatedDataRecords = dataRecords.map((retrievedData) => ({
                data: retrievedData.create_date.toISOString().split("T")[0],
                high: retrievedData.high,
                low: retrievedData.low
            }));
            break;

            case "pie":
                formatedDataRecords = dataRecords.map((retrievedData) => ({
                label: retrievedData.create_date.toISOString().split("T")[0],
                value: retrievedData.volume, 
                }));
                break
                
                default:
                    return res.status(400).json({error: "Invalid kind of graphic chart"})
        }
        return res.json({ type: chartType, dataRecords: formatedDataRecords });
    } catch (error){
        console.error(error);
        return res.status(500).json({error: "Error searching data for the graphic chart"})
    }
}