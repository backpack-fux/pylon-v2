-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETE', 'FAILED', 'ERROR');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('BILLING', 'SHIPPING', 'REGISTERED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('NOT_STARTED', 'PENDING', 'INCOMPLETE', 'AWAITING_UBO', 'MANUAL_REVIEW', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TosStatus" AS ENUM ('PENDING', 'APPROVED');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('BUSINESS', 'INDIVIDUAL');

-- CreateTable
CREATE TABLE "Merchant" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "surname" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "tokenAuth" TEXT,
    "phoneNumber" TEXT,
    "companyNumber" TEXT,
    "companyJurisdiction" CHAR(2),
    "fee" DECIMAL(4,2) NOT NULL DEFAULT 6.50,
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "addressId" BIGINT NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buyer" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "tokenAuth" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "walletAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "merchantId" INTEGER NOT NULL,
    "addressId" BIGINT,

    CONSTRAINT "Buyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compliance" (
    "id" UUID NOT NULL,
    "type" "AccountType" NOT NULL,
    "verificationDocumentLink" TEXT NOT NULL,
    "termsOfServiceLink" TEXT NOT NULL,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "termsOfServiceStatus" "TosStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "buyerId" BIGINT,
    "merchantId" INTEGER,

    CONSTRAINT "Compliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "partnerTokenId" TEXT NOT NULL,
    "partnerRequestId" TEXT NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "amount" BIGINT NOT NULL,
    "tip" DECIMAL(4,2) DEFAULT 0.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "buyerId" BIGINT NOT NULL,
    "merchantId" INTEGER NOT NULL,
    "addressId" BIGINT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhysicalAddress" (
    "id" BIGSERIAL NOT NULL,
    "type" "AddressType" NOT NULL,
    "street1" VARCHAR(50) NOT NULL,
    "street2" VARCHAR(50),
    "city" VARCHAR(50) NOT NULL,
    "postcode" VARCHAR(25),
    "state" CHAR(2),
    "country" CHAR(2) NOT NULL,

    CONSTRAINT "PhysicalAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_email_key" ON "Merchant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_phoneNumber_key" ON "Merchant"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_walletAddress_key" ON "Merchant"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_companyNumber_companyJurisdiction_key" ON "Merchant"("companyNumber", "companyJurisdiction");

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_email_key" ON "Buyer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_walletAddress_key" ON "Buyer"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Compliance_verificationDocumentLink_key" ON "Compliance"("verificationDocumentLink");

-- CreateIndex
CREATE UNIQUE INDEX "Compliance_termsOfServiceLink_key" ON "Compliance"("termsOfServiceLink");

-- AddForeignKey
ALTER TABLE "Merchant" ADD CONSTRAINT "Merchant_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "PhysicalAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buyer" ADD CONSTRAINT "Buyer_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buyer" ADD CONSTRAINT "Buyer_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "PhysicalAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compliance" ADD CONSTRAINT "Compliance_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Buyer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compliance" ADD CONSTRAINT "Compliance_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Buyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "PhysicalAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;
