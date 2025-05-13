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

// Get single product
export async function GetProductBySlug(slug:string) {
    return await prisma.product.findFirst({
        where: {slug: slug},
    });
}