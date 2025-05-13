'use server'
import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";

// Get latest products

export async function getLatestProducuts() {
    const data = await prisma.product.findMany({
        take: 4,
        orderBy: {createdAt:'desc'}
    });

    return convertToPlainObject(data);
}