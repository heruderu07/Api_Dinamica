import { db } from "@/db/db";
type ChartType = "line" | "bar" | "pie";

export async function getChartDataService(
    chartType: ChartType, 
    start: Date, 
    end: Date
) {

    const dataRecords = await db.uSD_BRL.findMany({
        where: {
            create_date: {
                gte: start,
                lte: end,
            },
        },
        orderBy: {
            create_date: "asc",
        },
    });

    if (dataRecords.length === 0) {
        return [];
    }

    let formatedDataRecords;

    switch (chartType) {
        case "line":
        case "bar":
            formatedDataRecords = dataRecords.map((retrievedData) => ({
                data: retrievedData.create_date.toISOString().split("T")[0],
                high: retrievedData.high,
                low: retrievedData.low,
            }));
            break;

        case "pie":
            formatedDataRecords = dataRecords.map((retrievedData) => ({
                label: retrievedData.create_date.toISOString().split("T")[0],
                value: retrievedData.volume,
            }));
            break;
            
        default:
             throw new Error("Invalid chart type provided to the Service layer.");
    }
    
    return formatedDataRecords;
}