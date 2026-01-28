/*
  Warnings:

  - You are about to drop the column `forParents` on the `newsletters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "newsletters" DROP COLUMN "forParents";

-- CreateTable
CREATE TABLE "ForParents" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "documentUrl" TEXT,
    "newsletterId" TEXT NOT NULL,

    CONSTRAINT "ForParents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ForParents" ADD CONSTRAINT "ForParents_newsletterId_fkey" FOREIGN KEY ("newsletterId") REFERENCES "newsletters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
