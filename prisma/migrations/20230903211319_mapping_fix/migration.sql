/*
  Warnings:

  - You are about to drop the `medias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "medias" DROP CONSTRAINT "medias_userId_fkey";

-- DropTable
DROP TABLE "medias";

-- CreateTable
CREATE TABLE "credentials" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "credentials_username_key" ON "credentials"("username");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_userId_label_key" ON "credentials"("userId", "label");

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
