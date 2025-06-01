import { z } from "zod";
import { insertProductSchema , insertCartSchema , cartItemSchema, cartResponseSchema , shippingAddressSchema } from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
    id: string;
    rating: string;
    createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type CartResponse = z.infer<typeof cartResponseSchema>
export type ShippingAddress = z.infer<typeof shippingAddressSchema>