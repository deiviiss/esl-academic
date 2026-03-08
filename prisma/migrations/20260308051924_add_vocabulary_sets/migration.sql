/*
  Warnings:

  - You are about to drop the `vocabularies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "vocabularies" DROP CONSTRAINT "vocabularies_newsletterId_fkey";

-- DropTable
DROP TABLE "vocabularies";

-- CreateTable
CREATE TABLE "vocabulary_sets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "newsletterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vocabulary_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary_images" (
    "id" TEXT NOT NULL,
    "setId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vocabulary_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vocabulary_sets" ADD CONSTRAINT "vocabulary_sets_newsletterId_fkey" FOREIGN KEY ("newsletterId") REFERENCES "newsletters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_images" ADD CONSTRAINT "vocabulary_images_setId_fkey" FOREIGN KEY ("setId") REFERENCES "vocabulary_sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
