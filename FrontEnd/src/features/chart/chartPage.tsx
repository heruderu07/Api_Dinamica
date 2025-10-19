import { useState } from "react";
import { useChartData } from "./userChartData";
import { ChartRenderer } from "../../components/chartRenderer";


const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export function ChartPage() {
    const [chartType, setChartType] = useState<"bar" | "line" | "pie">("line"); //pie

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000);
    const today = new Date();

    const [startDate, setStartDate] = useState(thirtyDaysAgo);
    const [endDate, setEndDate] = useState(today);
    
    const { data, loading, error } = useChartData(chartType, startDate, endDate);
    const handleDateChange = (dateString: string, setter: React.Dispatch<React.SetStateAction<Date>>) => {
        const localDateString = dateString + 'T00:00:00';
        const newDate = new Date(localDateString);
        if (!isNaN(newDate.getTime())) {
            setter(newDate);
        }
    };

    return (
        <div>
            <h1>Dashboard de Gráficos</h1>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                {}
                <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as "bar" | "line" | "pie")} >
                    <option value="line">Gráfico de Linha</option>
                    <option value="bar">Gráfico de Barras</option>
                    <option value="pie">Gráfico de Pizza</option>
                </select>

                {/* Seletor de Data Inicial */}
                <label>
                    Início:
                    <input
                        type="date"
                        value={formatDateForInput(startDate)} 
                        onChange={(e) => handleDateChange(e.target.value, setStartDate)}
                        max={formatDateForInput(endDate)}
                    />
                </label>

                {/* Seletor de Data Final */}
                <label>
                    Fim:
                    <input
                        type="date"
                        value={formatDateForInput(endDate)} 
                        onChange={(e) => handleDateChange(e.target.value, setEndDate)}
                        min={formatDateForInput(startDate)} // Garante que a data final não seja antes da inicial
                        max={formatDateForInput(today)} // Garante que a data final não seja no futuro
                    />
                </label>
            </div>

            {loading && <p>Carregando dados...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && <ChartRenderer chartType={chartType} data={data} />}
        </div>
    );
}