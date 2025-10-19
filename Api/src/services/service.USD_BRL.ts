import { db } from "@/db/db";
import { Prisma } from "@prisma/client";

export async function createRecordService(
    create_date: any,
    high: any, 
    low: any, 
    volume: any
) {
    try {
        const newRecord = await db.uSD_BRL.create({
            data: {
                create_date,
                high: parseFloat(high),
                low: parseFloat(low),   
                volume: parseFloat(volume),
            },
        });
        return newRecord;
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) throw error;
    }
}


// --- Lógica de Leitura (READ ALL) ---

export async function getRecordsService() {
    return await db.uSD_BRL.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
}


// --- Lógica de Leitura por ID (READ BY ID) ---

export async function getRecordByIdService(id: number) {
    return await db.uSD_BRL.findUnique({
        where: { id },
    });
}


// --- Lógica de Deleção (DELETE) ---

export async function deleteRecordByIdService(id: number) {
    try {
        return await db.uSD_BRL.delete({
            where: { id },
        });
    } catch (error) {
        // TRATAMENTO DE ERRO DO PRISMA (P2025)
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            // Lança o erro para o Controller mapear para 404
            throw new Error(`P2025: Id: ${id} not found.`);
        }
        throw error;
    }
}