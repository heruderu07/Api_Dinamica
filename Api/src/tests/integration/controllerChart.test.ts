import request from "supertest";
import app from "@/index";
import * as chartService from "@/services/service.chart";

jest.mock("../../services/service.chart");

describe("GET /chart/:chartType", () => {
  const mockedService = chartService.getChartDataService as unknown as jest.Mock;

  const validStart = "2023-01-01";
  const validEnd = "2023-12-31";

  it("retorna 400 se o tipo de gráfico for inválido", async () => {
    const res = await request(app).get("/api/v1/chart/invalid").query({
      startDate: validStart,
      endDate: validEnd,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid chart type/i);
  });

  // Testes parametrizados para os 3 tipos válidos
  describe.each(["line", "bar", "pie"])("tipo de gráfico: %s", (chartType) => {
    const endpoint = `/api/v1/chart/${chartType}`;

    it("retorna 400 se startDate ou endDate estiverem faltando", async () => {
      const res = await request(app).get(endpoint).query({
        startDate: validStart,
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/start date and end date are mandatory/i);
    });

    it("retorna 400 se o formato da data for inválido", async () => {
      const res = await request(app).get(endpoint).query({
        startDate: "data-invalida",
        endDate: validEnd,
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/invalid date format/i);
    });

    it("retorna 400 se a data de início for maior que a final", async () => {
      const res = await request(app).get(endpoint).query({
        startDate: "2024-12-31",
        endDate: "2024-01-01",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/start date cannot be later/i);
    });

    it("retorna 200 com array vazio e mensagem se não houver dados", async () => {
      mockedService.mockResolvedValueOnce([]);

      const res = await request(app).get(endpoint).query({
        startDate: validStart,
        endDate: validEnd,
      });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        type: chartType,
        dataRecords: [],
        message: expect.any(String),
      });
    });

    it("retorna 200 com os dados formatados corretamente", async () => {
      const mockData = [
        {
          data: "2023-01-01",
          high: 5.2,
          low: 4.9,
        },
      ];

      mockedService.mockResolvedValueOnce(mockData);

      const res = await request(app).get(endpoint).query({
        startDate: validStart,
        endDate: validEnd,
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        type: chartType,
        dataRecords: mockData,
      });
    });

    it("retorna 500 se houver erro interno no service", async () => {
      mockedService.mockRejectedValueOnce(new Error("Erro no banco"));

      const res = await request(app).get(endpoint).query({
        startDate: validStart,
        endDate: validEnd,
      });

      expect(res.status).toBe(500);
      expect(res.body.error).toMatch(/internal server error/i);
    });
  });
});
