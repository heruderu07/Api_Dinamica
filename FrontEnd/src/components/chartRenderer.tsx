import { Bar, Line, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    BarElement,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    ArcElement,
    BarElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    ChartDataLabels
);

interface ChartRendererProps {
    chartType: "bar" | "line" | "pie";
    data: { label: string; value: number; high: number; low: number, volume: number }[];
}

export function ChartRenderer({ chartType, data }: ChartRendererProps) {
    if (!Array.isArray(data)) {
        return <p>Dados inválidos</p>;
    }

    const labels = data.map((retrievedData) => retrievedData.label);
    const high = data.map((retrievedData) => retrievedData.high);
    const low = data.map((retrievedData) => retrievedData.low);
    const volume = data.map((retrievedData) => retrievedData.volume);


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
                    backgroundColor: '#F2996B',
                    borderColor: '#F2996B',
                    borderWidth: 1,
                },
            ],
        };
            const barOptions = {
                responsive: true,
                plugins: {
                    datalabels: {
                        display: false, 
                    },
                },
            };

        return <Bar data={barData} options={barOptions} />;
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
                    backgroundColor: '#F2996B',
                    borderColor: '#F2996B',
                    tension: 0.1,
                },
            ],
        };

             const lineOptions = {
                responsive: true,
                plugins: {
                    datalabels: {
                        display: false, 
                    },
                },
            };

        return <Line data={lineData} options={lineOptions} />;
    }

    if (chartType === "pie") {
        const pieData = {
            labels,
            datasets: [
                {
                    label: "Porcentagem de volume por intervalo de datas",
                    data: volume,
                    backgroundColor: [
                        '#696AF1',
                        '#F2996B',
                        '#8AF26B',
                    ],
                    borderColor: [
                        '#696AF1',
                        '#F2996B',
                        '#8AF26B',
                    ],
                    borderWidth: 1,
                    hoverOffset: 4,
                },
            ],
        };

        const piePercentage = {
            responsive: true,
            plugins: {
                datalabels: {
                    formatter: (value: number, context: any) => {
                        const total = context.chart.data.datasets[0].data.reduce((sum: number, dataValue: number) => sum + dataValue, 0);
                        const percentage = (value / total) * 100;
                        return `${value.toLocaleString('pt-BR')}\n(${percentage.toFixed(1)}%)`;
                    },
                    color: '#fff',
                    font: {
                        weight: 'bold' as const,
                        size: 14,
                    },
                    anchor: 'center' as const,
                    align: 'center' as const,
                },
                title: {
                    display: true,
                    text: "Distribuição do Volume",
                }
            },
        };
        return <Pie data={pieData} options={piePercentage} />;
        //pie
    }
    return null;
}