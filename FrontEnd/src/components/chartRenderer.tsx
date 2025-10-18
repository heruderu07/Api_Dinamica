import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    //ArcElement -> pie
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    BarElement,
} from "chart.js";

ChartJS.register(
    BarElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
);

interface ChartRendererProps {
    chartType: "bar" | "line";
    data: { label: string; value: number; high: number; low: number }[];
}

export function ChartRenderer({ chartType, data }: ChartRendererProps) {
    if (!Array.isArray(data)) {
        return <p>Dados inválidos</p>;
    }

    const labels = data.map((retrievedData) => retrievedData.label);
    const high = data.map((retrievedData) => retrievedData.high);
    const low = data.map((retrievedData) => retrievedData.low);


    if (chartType === "bar") {
        const barData = {
            labels,
            datasets: [
                {
                    label: "Máxima do Dólar",
                    data: high,
                    backgroundColor: 'rgba(42, 112, 27, 1)',
                    borderColor: 'rgba(42, 112, 27, 1)',
                    borderWidth: 1,
                },
                {
                    label: "Mínima do Dólar",
                    data: low,
                    backgroundColor: 'rgba(235, 54, 54, 1)',
                    borderColor: 'rgba(235, 54, 54, 1)',
                    borderWidth: 1,
                },
            ],
        };


        return <Bar data={barData} />;
    }

    if (chartType === "line") {
        const lineData = {
            labels,
            datasets: [
                {
                    label: "Máxima do Dólar",
                    data: high,
                    backgroundColor: 'rgba(42, 112, 27, 1)',
                    borderColor: 'rgba(42, 112, 27, 1)',
                    tension: 0.1,
                },
                {
                    label: "Mínima do Dólar",
                    data: low,
                    backgroundColor: 'rgba(235, 54, 54, 1)',
                    borderColor: 'rgba(235, 54, 54, 1)',
                    tension: 0.1,
                },
            ],
        };

        return <Line data={lineData} />;
    }
    return null;
}