import { useState, useEffect } from "react";
import { getChartData } from "../../api/usdbrlService";
import { formatDate } from "../../utils/formatDate";

interface ChartData {
  label: string;
  value: number;
  high: number;
  low: number;
  volume: number;
}

export function useChartData(
  chartType: "bar" | "line" | "pie",
  startDate: Date,
  endDate: Date
) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      setData([]);

      try {
        const result = await getChartData(
          chartType,
          formatDate(startDate),
          formatDate(endDate)
        );
        console.log("Dados recebidos da API:", result); //Testando recebimento de dados da api

        const rawDataArray = result.dataRecords;

        if (Array.isArray(rawDataArray)) {
          const formattedData = rawDataArray.map((record: any) => {
            if (chartType === "pie") {
              return {
                label: record.label,        
                value: record.value,        
                high: 0,                    
                low: 0,
                volume: record.value        
              };
            } else {
              return {
                label: record.data,         
                value: record.high,
                high: record.high,
                low: record.low,
                volume: 0                   
              };
            }
          });

          setData(formattedData);
        } else {
          console.error("The key 'dataRecords' does not contain an array:", rawDataArray);
          setError("Unexpected data format received from the API.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error loading data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [chartType, startDate, endDate]);

  return { data, loading, error };
}
