import { getChartDataService } from "@/services/service.chart"; // ajuste conforme seu path
import { db } from "@/db/db";

jest.mock("@/db/db", () => ({
  db: {
    uSD_BRL: {
      findMany: jest.fn(),
    },
  },
}));

describe("getChartDataService", () => {
  const mockFindMany = db.uSD_BRL.findMany as jest.Mock;

  const sampleData = [
    {
      create_date: new Date("2023-01-01T00:00:00Z"),
      high: 10,
      low: 5,
      volume: 1000,
    },
    {
      create_date: new Date("2023-01-02T00:00:00Z"),
      high: 15,
      low: 7,
      volume: 1500,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return empty array if no data", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await getChartDataService("line", new Date("2023-01-01"), new Date("2023-01-10"));
    expect(result).toEqual([]);
    expect(mockFindMany).toHaveBeenCalled();
  });

  it("should format data correctly for 'line' chart", async () => {
    mockFindMany.mockResolvedValue(sampleData);

    const result = await getChartDataService("line", new Date("2023-01-01"), new Date("2023-01-10"));

    expect(result).toEqual([
      { data: "2023-01-01", high: 10, low: 5 },
      { data: "2023-01-02", high: 15, low: 7 },
    ]);
  });

  it("should format data correctly for 'bar' chart", async () => {
    mockFindMany.mockResolvedValue(sampleData);

    const result = await getChartDataService("bar", new Date("2023-01-01"), new Date("2023-01-10"));

    expect(result).toEqual([
      { data: "2023-01-01", high: 10, low: 5 },
      { data: "2023-01-02", high: 15, low: 7 },
    ]);
  });

  it("should format data correctly for 'pie' chart", async () => {
    mockFindMany.mockResolvedValue(sampleData);

    const result = await getChartDataService("pie", new Date("2023-01-01"), new Date("2023-01-10"));

    expect(result).toEqual([
      { label: "2023-01-01", value: 1000 },
      { label: "2023-01-02", value: 1500 },
    ]);
  });

  it("should throw error on invalid chart type", async () => {
    mockFindMany.mockResolvedValue(sampleData);

    // @ts-expect-error Testing invalid input
    await expect(getChartDataService("invalid", new Date("2023-01-01"), new Date("2023-01-10"))).rejects.toThrow(
      "Invalid chart type provided to the Service layer."
    );
  });
});
