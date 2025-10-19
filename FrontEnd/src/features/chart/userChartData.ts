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
        console.log("Dados recebidos da API:", result);

        const rawDataArray = result.dataRecords;

        if (Array.isArray(rawDataArray)) {
          const formattedData = rawDataArray.map((record: any) => {
            if (chartType === "pie") {
              return {
                label: record.label,        // recebido do backend
                value: record.value,        // volume
                high: 0,                    // não utilizado
                low: 0,
                volume: record.value        // usado pelo gráfico de pizza
              };
            } else {
              return {
                label: record.data,         // recebido do backend
                value: record.high,
                high: record.high,
                low: record.low,
                volume: 0                   // não utilizado nesse caso
              };
            }
          });

          setData(formattedData);
        } else {
          console.error("A chave 'dataRecords' não contém um array:", rawDataArray);
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
