/*
  Warnings:

  - Added the required column `fileName` to the `videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "videos" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL;
