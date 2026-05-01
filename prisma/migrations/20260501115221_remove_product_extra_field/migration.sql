/*
  Warnings:

  - You are about to drop the column `color` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."product" DROP COLUMN "color",
DROP COLUMN "height",
DROP COLUMN "rating",
DROP COLUMN "width";
