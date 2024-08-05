/*
  Warnings:

  - You are about to drop the column `addressId` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `companyJurisdiction` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `companyNumber` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `surname` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `tokenAuth` on the `Merchant` table. All the data in the column will be lost.
  - You are about to alter the column `walletAddress` on the `Merchant` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(42)`.
  - You are about to drop the `Buyer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhysicalAddress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `companyId` to the `Merchant` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CredentialAlgorithm" AS ENUM ('RS256', 'ES256');

-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('OWNER', 'BOOKKEEPER', 'DEVELOPER');

-- DropForeignKey
ALTER TABLE "Buyer" DROP CONSTRAINT "Buyer_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Buyer" DROP CONSTRAINT "Buyer_merchantId_fkey";

-- DropForeignKey
ALTER TABLE "Compliance" DROP CONSTRAINT "Compliance_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Merchant" DROP CONSTRAINT "Merchant_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_buyerId_fkey";

-- DropIndex
DROP INDEX "Merchant_companyNumber_companyJurisdiction_key";

-- DropIndex
DROP INDEX "Merchant_email_key";

-- DropIndex
DROP INDEX "Merchant_phoneNumber_key";

-- AlterTable
ALTER TABLE "Merchant" DROP COLUMN "addressId",
DROP COLUMN "companyJurisdiction",
DROP COLUMN "companyNumber",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phoneNumber",
DROP COLUMN "surname",
DROP COLUMN "tokenAuth",
ADD COLUMN     "companyId" BIGINT NOT NULL,
ALTER COLUMN "walletAddress" SET DATA TYPE CHAR(42);

-- DropTable
DROP TABLE "Buyer";

-- DropTable
DROP TABLE "PhysicalAddress";

-- CreateTable
CREATE TABLE "Company" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "number" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "addressId" BIGINT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "surname" VARCHAR(255) NOT NULL,
    "role" "EmployeeRole" NOT NULL,
    "merchantId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "rainId" VARCHAR(36),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "surname" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "merchantId" INTEGER NOT NULL,
    "addressId" BIGINT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "walletAddress" CHAR(42),
    "username" VARCHAR(15),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" BIGSERIAL NOT NULL,
    "street1" VARCHAR(50) NOT NULL,
    "street2" VARCHAR(50),
    "city" VARCHAR(50) NOT NULL,
    "postcode" VARCHAR(25),
    "state" CHAR(2),
    "country" CHAR(2) NOT NULL,
    "type" "AddressType" NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegisteredPasskey" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "credentialId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "algorithm" "CredentialAlgorithm" NOT NULL DEFAULT 'ES256',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegisteredPasskey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "merchantId" INTEGER NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_number_key" ON "Company"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_rainId_key" ON "Employee"("rainId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userId_merchantId_key" ON "Customer"("userId", "merchantId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "RegisteredPasskey_credentialId_key" ON "RegisteredPasskey"("credentialId");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");

-- CreateIndex
CREATE INDEX "ApiKey_key_idx" ON "ApiKey"("key");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Merchant" ADD CONSTRAINT "Merchant_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compliance" ADD CONSTRAINT "Compliance_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegisteredPasskey" ADD CONSTRAINT "RegisteredPasskey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
