-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_admin_listing_idx"
ON "products"("updated_at" DESC, "created_at" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "product_images_product_gallery_idx"
ON "product_images"("product_id", "is_main" DESC, "sort_order" ASC, "created_at" ASC, "id" ASC);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "products_public_visible_listing_idx"
ON "products"("is_featured" DESC, "created_at" DESC, "id" DESC)
WHERE "is_public_visible" = true
  AND "is_archived" = false
  AND "status" <> 'rascunho'
  AND "main_image_id" IS NOT NULL
  AND "category" IS NOT NULL
  AND "subcategory" IS NOT NULL
  AND "brand" IS NOT NULL
  AND "model" IS NOT NULL
  AND "condition" IS NOT NULL
  AND "description" IS NOT NULL
  AND "technical_specs" IS NOT NULL
  AND "city" IS NOT NULL
  AND "state" IS NOT NULL;
