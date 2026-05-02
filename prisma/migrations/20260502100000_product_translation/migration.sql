-- CreateEnum
CREATE TYPE "public"."Locale" AS ENUM ('uk', 'ru', 'en');

-- CreateTable
CREATE TABLE "public"."product_translation" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "locale" "public"."Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "title_seo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_translation_pkey" PRIMARY KEY ("id")
);

-- Backfill RU translations from legacy columns
INSERT INTO "public"."product_translation" ("id", "product_id", "locale", "title", "description", "title_seo", "created_at", "updated_at")
SELECT gen_random_uuid()::text, p."id", 'ru'::"public"."Locale", p."title", p."description", NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "public"."product" AS p;

-- CreateIndex
CREATE UNIQUE INDEX "product_translation_product_id_locale_key" ON "public"."product_translation"("product_id", "locale");

-- AddForeignKey
ALTER TABLE "public"."product_translation" ADD CONSTRAINT "product_translation_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
