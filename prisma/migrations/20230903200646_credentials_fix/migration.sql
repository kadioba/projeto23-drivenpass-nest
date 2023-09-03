/*
  Warnings:

  - Added the required column `url` to the `medias` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medias" ADD COLUMN     "url" TEXT NOT NULL;
