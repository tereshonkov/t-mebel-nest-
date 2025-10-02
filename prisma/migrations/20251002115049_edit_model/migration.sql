/*
  Warnings:

  - You are about to drop the column `called` on the `visitor` table. All the data in the column will be lost.
  - You are about to drop the column `visits` on the `visitor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."visitor" DROP COLUMN "called",
DROP COLUMN "visits";
