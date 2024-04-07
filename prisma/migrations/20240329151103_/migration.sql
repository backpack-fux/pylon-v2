/*
  Warnings:

  - Made the column `phoneNumber` on table `Buyer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Buyer_phoneNumber_key";

-- AlterTable
ALTER TABLE "Buyer" ALTER COLUMN "phoneNumber" SET NOT NULL;
