/*
  Warnings:

  - A unique constraint covering the columns `[userId,label]` on the table `cards` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `label` to the `cards` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "cards_userId_number_key";

-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "label" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cards_userId_label_key" ON "cards"("userId", "label");
