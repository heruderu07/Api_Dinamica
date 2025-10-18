import { apiClient } from "./apiClient";

export async function getChartData(
    chartType: string,
    startDate: string,
    endDate: string
) {
    const response = await apiClient.get(`/chart/${chartType}` , {
    params: { startDate, endDate },
});

return response.data
}