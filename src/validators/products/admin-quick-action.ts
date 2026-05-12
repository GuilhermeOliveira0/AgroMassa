import { z } from "zod";

import { ADMIN_PRODUCT_STATUS_VALUES } from "./admin-product";

const productIdSchema = z.uuid("Produto invalido.");

export const adminQuickProductActionSchema = z.discriminatedUnion("type", [
  z.object({
    productId: productIdSchema,
    status: z.enum(ADMIN_PRODUCT_STATUS_VALUES),
    type: z.literal("status"),
  }),
  z.object({
    isPublicVisible: z.boolean(),
    productId: productIdSchema,
    type: z.literal("visibility"),
  }),
  z.object({
    isFeatured: z.boolean(),
    productId: productIdSchema,
    type: z.literal("featured"),
  }),
  z.object({
    isArchived: z.boolean(),
    productId: productIdSchema,
    type: z.literal("archive"),
  }),
]);

export type AdminQuickProductActionInput = z.infer<
  typeof adminQuickProductActionSchema
>;
