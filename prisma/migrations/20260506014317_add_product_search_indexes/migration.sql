-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateIndex
CREATE INDEX "products_category_idx" ON "products"("category");

-- CreateIndex
CREATE INDEX "products_condition_idx" ON "products"("condition");

-- CreateIndex
CREATE INDEX "products_brand_idx" ON "products"("brand");

-- CreateIndex
CREATE INDEX "products_status_idx" ON "products"("status");

-- CreateIndex
CREATE INDEX "products_public_listing_idx" ON "products"("is_public_visible", "is_archived", "is_featured" DESC, "created_at" DESC);

-- CreateIndex
CREATE INDEX "products_search_text_trgm_idx" ON "products" USING GIN ("search_text_normalized" gin_trgm_ops);
