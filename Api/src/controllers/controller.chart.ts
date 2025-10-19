import { Request, Response } from "express";
import { getChartDataService } from "../services/service.chart";

const VALID_CHART_TYPES = ["line", "bar", "pie"];

export async function getChartData(req: Request, res: Response) {
  const { chartType } = req.params;
  const { startDate, endDate } = req.query;

  if (!chartType || !VALID_CHART_TYPES.includes(chartType as string)) {
    return res
      .status(400)
      .json({ error: "Invalid chart type. Use 'line', 'bar', or 'pie'." });
  }

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "The start date and end date are mandatory." });
  }

  const start = new Date(startDate as string);
  const end = new Date(endDate as string);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return res.status(400).json({
      error:
        "Invalid date format or the start date cannot be later than the end date.",
    });
  }

  try {
    const formatedDataRecords = await getChartDataService(
      chartType as "line" | "bar" | "pie",
      start,
      end
    );

    if (formatedDataRecords.length === 0) {
      return res.status(200).json({
        type: chartType,
        dataRecords: [],
        message: "Nenhum registro encontrado para o período especificado.",
      });
    }

    return res
      .status(200)
      .json({ type: chartType, dataRecords: formatedDataRecords });
  } catch (error) {
    console.error("Error accessing the database or Service: ", error);
    return res
      .status(500)
      .json({
        error:
          "Internal server error when fetching data. Please check the database connection.",
      });
  }
}
