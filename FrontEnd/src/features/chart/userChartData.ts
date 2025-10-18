import { useState, useEffect } from "react";
import { getChartData } from "../../api/usdbrlService";
import { formatDate } from "../../utils/formatDate";

interface ChartData {
  label: string;
  value: number;
  high: number;
  low: number;
}

export function useChartData(
  chartType: "bar" | "line",
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
        console.log("Dados recebidos da API:", result);

        const rawDataArray = result.dataRecords;

        if (Array.isArray(rawDataArray)) {
          const formattedData = rawDataArray.map((record) => ({
            label: record.data, 
            value: record.high,
            high: record.high,
            low: record.low 
          }));

          setData(formattedData);
        } else {
          console.error(
            "A chave 'dataRecords' não contém um array:",
            rawDataArray
          );
          setError("Formato de dados inesperado recebido da API.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError("Erro ao carregar os dados. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [chartType, startDate, endDate]);

  return { data, loading, error };
}
