-- CreateEnum
CREATE TYPE "product_category" AS ENUM ('tratores', 'implementos');

-- CreateEnum
CREATE TYPE "product_condition" AS ENUM ('novo', 'usado', 'seminovo');

-- CreateEnum
CREATE TYPE "product_status" AS ENUM ('disponivel', 'vendido', 'sob_consulta', 'alugado', 'rascunho');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(190) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" UUID NOT NULL,
    "company_name" VARCHAR(160) NOT NULL,
    "logo_path" VARCHAR(255) NOT NULL,
    "institutional_text" TEXT NOT NULL,
    "services_text" TEXT NOT NULL,
    "phone_display" VARCHAR(40) NOT NULL,
    "whatsapp_display" VARCHAR(40) NOT NULL,
    "whatsapp_digits" VARCHAR(20) NOT NULL,
    "city" VARCHAR(120) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "updated_by_admin_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "category" "product_category",
    "subcategory" VARCHAR(80),
    "brand" VARCHAR(120),
    "model" VARCHAR(120),
    "year" INTEGER,
    "condition" "product_condition",
    "description" TEXT,
    "technical_specs" TEXT,
    "price_cents" INTEGER,
    "price_visible" BOOLEAN NOT NULL DEFAULT true,
    "status" "product_status" NOT NULL DEFAULT 'rascunho',
    "city" VARCHAR(120),
    "state" VARCHAR(2),
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_public_visible" BOOLEAN NOT NULL DEFAULT false,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "main_image_id" UUID,
    "search_text_normalized" TEXT NOT NULL DEFAULT '',
    "created_by_admin_id" UUID NOT NULL,
    "updated_by_admin_id" UUID NOT NULL,
    "published_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "storage_key" VARCHAR(255) NOT NULL,
    "public_url" VARCHAR(500) NOT NULL,
    "original_filename" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(80) NOT NULL,
    "file_size_bytes" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_main_image_id_key" ON "products"("main_image_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_images_storage_key_key" ON "product_images"("storage_key");

-- AddForeignKey
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_updated_by_admin_id_fkey" FOREIGN KEY ("updated_by_admin_id") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_created_by_admin_id_fkey" FOREIGN KEY ("created_by_admin_id") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_updated_by_admin_id_fkey" FOREIGN KEY ("updated_by_admin_id") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_main_image_id_fkey" FOREIGN KEY ("main_image_id") REFERENCES "product_images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
