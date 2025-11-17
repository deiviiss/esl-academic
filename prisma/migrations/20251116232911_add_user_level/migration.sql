/*
  Warnings:

  - You are about to drop the column `hasPurchasedOnce` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Level" AS ENUM ('toddlers', 'nursery', 'prek');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "hasPurchasedOnce",
ADD COLUMN     "level" "Level";
