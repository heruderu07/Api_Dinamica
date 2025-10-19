import * as service from "@/services/service.USD_BRL";
import { db } from "@/db/db";
import { Prisma } from "@prisma/client";

jest.mock("@/db/db", () => ({
  db: {
    uSD_BRL: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

function createPrismaError(code: string, message: string) {
  const error = Object.create(Prisma.PrismaClientKnownRequestError.prototype);
  return Object.assign(error, {
    code,
    message,
    clientVersion: "4.0.0", // ou qualquer versão
    name: "PrismaClientKnownRequestError",
  });
}

describe("USD_BRL Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createRecordService", () => {
    it("should create a new record with parsed floats", async () => {
      const input = {
        create_date: new Date("2023-01-01"),
        high: "5",
        low: "4.5",
        volume: "1000",
      };

      const mockCreated = { id: 1, ...input, high: 5, low: 4.5, volume: 1000 };
      (db.uSD_BRL.create as jest.Mock).mockResolvedValue(mockCreated);

      const result = await service.createRecordService(
        input.create_date,
        input.high,
        input.low,
        input.volume
      );

      expect(db.uSD_BRL.create).toHaveBeenCalledWith({
        data: {
          create_date: input.create_date,
          high: 5,
          low: 4.5,
          volume: 1000,
        },
      });
      expect(result).toEqual(mockCreated);
    });

    it("should throw PrismaClientKnownRequestError with code P2002", async () => {
      const prismaError = createPrismaError("P2002", "Unique constraint failed");
      (db.uSD_BRL.create as jest.Mock).mockRejectedValue(prismaError);

      await expect(
        service.createRecordService(new Date(), "1", "1", "1")
      ).rejects.toThrow(prismaError);

      expect(db.uSD_BRL.create).toHaveBeenCalled();
    });

    it("should swallow other errors", async () => {
      const otherError = new Error("Other error");
      (db.uSD_BRL.create as jest.Mock).mockRejectedValue(otherError);

      const result = await service.createRecordService(new Date(), "1", "1", "1");

      expect(result).toBeUndefined();
    });
  });

  describe("getRecordsService", () => {
    it("should fetch all records ordered by createdAt desc", async () => {
      const records = [{ id: 1 }, { id: 2 }];
      (db.uSD_BRL.findMany as jest.Mock).mockResolvedValue(records);

      const result = await service.getRecordsService();

      expect(db.uSD_BRL.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(records);
    });
  });

  describe("getRecordByIdService", () => {
    it("should fetch record by id", async () => {
      const record = { id: 1, high: 5 };
      (db.uSD_BRL.findUnique as jest.Mock).mockResolvedValue(record);

      const result = await service.getRecordByIdService(1);

      expect(db.uSD_BRL.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(record);
    });
  });

  describe("deleteRecordByIdService", () => {
    it("should delete record by id", async () => {
      const deleted = { id: 1 };
      (db.uSD_BRL.delete as jest.Mock).mockResolvedValue(deleted);

      const result = await service.deleteRecordByIdService(1);

      expect(db.uSD_BRL.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(deleted);
    });

    it("should throw error with message on Prisma P2025 error", async () => {
      const prismaError = createPrismaError("P2025", "Record not found");
      (db.uSD_BRL.delete as jest.Mock).mockRejectedValue(prismaError);

      await expect(service.deleteRecordByIdService(999)).rejects.toThrow(
        "P2025: Id: 999 not found."
      );

      expect(db.uSD_BRL.delete).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });

    it("should rethrow other errors", async () => {
      const otherError = new Error("Some other error");
      (db.uSD_BRL.delete as jest.Mock).mockRejectedValue(otherError);

      await expect(service.deleteRecordByIdService(1)).rejects.toThrow(otherError);

      expect(db.uSD_BRL.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
