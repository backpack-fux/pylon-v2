-- CreateEnum
CREATE TYPE "CredentialAlgorithm" AS ENUM ('RS256', 'ES256');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" VARCHAR(15) NOT NULL,
    "rain" VARCHAR(36),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RainCompany" (
    "id" SERIAL NOT NULL,
    "ref" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RainCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RainMembers" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "RainMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegisteredDevice" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL DEFAULT '',
    "credentialId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "algorithm" "CredentialAlgorithm" NOT NULL DEFAULT 'ES256',
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegisteredDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_rain_key" ON "User"("rain");

-- CreateIndex
CREATE UNIQUE INDEX "RainCompany_ref_key" ON "RainCompany"("ref");

-- CreateIndex
CREATE UNIQUE INDEX "RegisteredDevice_credentialId_key" ON "RegisteredDevice"("credentialId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- AddForeignKey
ALTER TABLE "RainMembers" ADD CONSTRAINT "RainMembers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "RainCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RainMembers" ADD CONSTRAINT "RainMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegisteredDevice" ADD CONSTRAINT "RegisteredDevice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "RegisteredDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
