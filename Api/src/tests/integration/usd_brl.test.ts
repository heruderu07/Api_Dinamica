import request from "supertest";
import app from "@/index";
import * as service from "@/services/service.USD_BRL";
import { Prisma } from "@prisma/client";

jest.mock("../../services/service.USD_BRl");

describe("USD_BRL Controller Integration Tests", () => {
  describe("POST /api/v1/usd_brl", () => {
    it("should create a new record", async () => {
      const newRecord = {
        id: 1,
        createdAt: new Date(),
        create_date: new Date("2023-01-01"),
        high: 5.0,
        low: 4.5,
        volume: 1000,
      };

      jest.spyOn(service, "createRecordService").mockResolvedValue(newRecord);

      const res = await request(app).post("/api/v1/usd_brl").send({
        create_date: "2023-01-01",
        high: 5.0,
        low: 4.5,
        volume: 1000,
      });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        ...newRecord,
        createdAt: newRecord.createdAt.toISOString(),
        create_date: newRecord.create_date.toISOString(),
      });
    });

    it("should return 400 if data is invalid", async () => {
      const res = await request(app).post("/api/v1/usd_brl").send({
        create_date: "",
        high: "not-a-number",
        low: 4.5,
        volume: 1000,
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/invalid or incomplete record data/i);
    });

    it("should return 409 if duplicate record error", async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        "Unique constraint failed",
        {
          code: "P2002",
          clientVersion: "3.0.0",
        }
      );

      jest.spyOn(service, "createRecordService").mockRejectedValue(error);

      const res = await request(app).post("/api/v1/usd_brl").send({
        create_date: "2023-01-01",
        high: 5.0,
        low: 4.5,
        volume: 1000,
      });

      expect(res.status).toBe(409);
      expect(res.body.error).toMatch(/there is already a record/i);
    });

    it("should return 500 on other errors", async () => {
      jest.spyOn(service, "createRecordService").mockRejectedValue(new Error("Failure"));

      const res = await request(app).post("/api/v1/usd_brl").send({
        create_date: "2023-01-01",
        high: 5.0,
        low: 4.5,
        volume: 1000,
      });

      expect(res.status).toBe(500);
      expect(res.body.error).toMatch(/internal failure/i);
    });
  });

  describe("GET /api/v1/usd_brl", () => {
    it("should get all records", async () => {
      const records = [
        {
          id: 1,
          createdAt: new Date(),
          create_date: new Date("2023-01-01"),
          high: 5.0,
          low: 4.5,
          volume: 1000,
        },
      ];

      jest.spyOn(service, "getRecordsService").mockResolvedValue(records);

      const res = await request(app).get("/api/v1/usd_brl");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        records.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
          create_date: r.create_date.toISOString(),
        }))
      );
    });

    it("should return 500 on error", async () => {
      jest.spyOn(service, "getRecordsService").mockRejectedValue(new Error("Service failure"));

      const res = await request(app).get("/api/v1/usd_brl");

      expect(res.status).toBe(500);
      expect(res.body.error).toMatch(/it was not possible to fetch/i);
    });
  });

  describe("GET /api/v1/usd_brl/:id", () => {
    it("should get record by id", async () => {
      const record = {
        id: 1,
        createdAt: new Date(),
        create_date: new Date("2023-01-01"),
        high: 5.0,
        low: 4.5,
        volume: 1000,
      };

      jest.spyOn(service, "getRecordByIdService").mockResolvedValue(record);

      const res = await request(app).get("/api/v1/usd_brl/1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        ...record,
        createdAt: record.createdAt.toISOString(),
        create_date: record.create_date.toISOString(),
      });
    });

    it("should return 400 for invalid id", async () => {
      const res = await request(app).get("/api/v1/usd_brl/abc");

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/invalid id/i);
    });

    it("should return 404 if record not found", async () => {
      jest.spyOn(service, "getRecordByIdService").mockResolvedValue(null);

      const res = await request(app).get("/api/v1/usd_brl/999");

      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/doesn't exist/i);
    });

    it("should return 500 on error", async () => {
      jest.spyOn(service, "getRecordByIdService").mockRejectedValue(new Error("Failure"));

      const res = await request(app).get("/api/v1/usd_brl/1");

      expect(res.status).toBe(500);
      expect(res.body.error).toMatch(/it was not possible to fetch/i);
    });
  });

  describe("DELETE /api/v1/usd_brl/:id", () => {
    it("should delete record by id", async () => {
      const deletedRecord = {
        id: 1,
        createdAt: new Date(),
        create_date: new Date("2023-01-01"),
        high: 5.0,
        low: 4.5,
        volume: 1000,
      };

      jest.spyOn(service, "deleteRecordByIdService").mockResolvedValue(deletedRecord);

      const res = await request(app).delete("/api/v1/usd_brl/1");

      expect(res.status).toBe(200);
      expect(res.text).toMatch(/successfully deleted/i);
    });

    it("should return 400 for invalid id", async () => {
      const res = await request(app).delete("/api/v1/usd_brl/abc");

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/invalid id/i);
    });

    it("should return 404 if record not found", async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        "Record not found",
        {
          code: "P2025",
          clientVersion: "3.0.0",
        }
      );

      jest.spyOn(service, "deleteRecordByIdService").mockRejectedValue(error);

      const res = await request(app).delete("/api/v1/usd_brl/999");

      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/not found/i);
    });

    it("should return 500 on error", async () => {
      jest.spyOn(service, "deleteRecordByIdService").mockRejectedValue(new Error("Failure"));

      const res = await request(app).delete("/api/v1/usd_brl/1");

      expect(res.status).toBe(500);
      expect(res.body.error).toMatch(/it was not possible to delete/i);
    });
  });
});
