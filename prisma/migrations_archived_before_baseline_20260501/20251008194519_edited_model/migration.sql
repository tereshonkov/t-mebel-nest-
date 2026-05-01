/*
  Warnings:

  - You are about to drop the column `visitor_id` on the `call_click` table. All the data in the column will be lost.
  - You are about to drop the `page_visit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `visitor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."call_click" DROP CONSTRAINT "call_click_visitor_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."page_visit" DROP CONSTRAINT "page_visit_visitor_id_fkey";

-- AlterTable
ALTER TABLE "public"."call_click" DROP COLUMN "visitor_id";

-- DropTable
DROP TABLE "public"."page_visit";

-- DropTable
DROP TABLE "public"."visitor";
