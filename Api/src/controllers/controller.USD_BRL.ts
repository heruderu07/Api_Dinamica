import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import {
  createRecordService,
  getRecordsService,
  getRecordByIdService,
  deleteRecordByIdService,
} from "../services/service.USD_BRL";

export async function createRecord(req: Request, res: Response) {
  const { create_date, high, low, volume } = req.body;

  if (!create_date || isNaN(high) || isNaN(low) || isNaN(volume)) {
    return res.status(400).json({
      error:
        "Invalid or incomplete record data. 'create_date' is required, and 'high', 'low', and 'volume' must be valid numbers.",
    });
  }

  try {
    const newRecord = await createRecordService(create_date, high, low, volume);

    return res.status(201).json(newRecord);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        error: `There is already a record for the date: ${create_date}`,
      });
    }
    console.error("Error creating record:", error);
    return res
      .status(500)
      .json({ error: "Internal failure while creating the record." });
  }
}

export async function getRecords(req: Request, res: Response) {
  try {
    const records = await getRecordsService();
    return res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching records:", error);
    return res
      .status(500)
      .json({ error: "It was not possible to fetch the records." });
  }
}

export async function getRecordById(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid Id." });
  }

  try {
    const records = await getRecordByIdService(id);

    if (!records) {
      return res.status(404).json({ error: `Id: ${id} doesn't exist.` });
    }
    return res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching records:", error);
    return res
      .status(500)
      .json({ error: "It was not possible to fetch the records." });
  }
}

export async function deleteRecordById(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid Id." });
  }

  try {
    const records = await deleteRecordByIdService(id);

    return res
      .status(200)
      .json(`Record of ${records.create_date} successfully deleted.`);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ error: `Id: ${id} not found.` });
    }

    console.error("Error deleting record:", error);
    return res
      .status(500)
      .json({ error: "It was not possible to delete the record." });
  }
}
