/*
  Warnings:

  - You are about to drop the column `level` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "level";

-- DropEnum
DROP TYPE "Level";

-- CreateTable
CREATE TABLE "parent_childs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,

    CONSTRAINT "parent_childs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "childrens" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,

    CONSTRAINT "childrens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "levels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletters" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "year" INTEGER NOT NULL,
    "forParents" TEXT NOT NULL,
    "documentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabularies" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "pronunciation" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "newsletterId" TEXT NOT NULL,

    CONSTRAINT "vocabularies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "newsletterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlists" (
    "id" TEXT NOT NULL,
    "newsletterId" TEXT NOT NULL,
    "title" TEXT,

    CONSTRAINT "playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlist_links" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "url" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,

    CONSTRAINT "playlist_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LevelToNewsletter" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LevelToNewsletter_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "parent_childs_userId_childId_key" ON "parent_childs"("userId", "childId");

-- CreateIndex
CREATE UNIQUE INDEX "playlists_newsletterId_key" ON "playlists"("newsletterId");

-- CreateIndex
CREATE INDEX "_LevelToNewsletter_B_index" ON "_LevelToNewsletter"("B");

-- AddForeignKey
ALTER TABLE "parent_childs" ADD CONSTRAINT "parent_childs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_childs" ADD CONSTRAINT "parent_childs_childId_fkey" FOREIGN KEY ("childId") REFERENCES "childrens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "childrens" ADD CONSTRAINT "childrens_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabularies" ADD CONSTRAINT "vocabularies_newsletterId_fkey" FOREIGN KEY ("newsletterId") REFERENCES "newsletters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_newsletterId_fkey" FOREIGN KEY ("newsletterId") REFERENCES "newsletters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlists" ADD CONSTRAINT "playlists_newsletterId_fkey" FOREIGN KEY ("newsletterId") REFERENCES "newsletters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_links" ADD CONSTRAINT "playlist_links_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "playlists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LevelToNewsletter" ADD CONSTRAINT "_LevelToNewsletter_A_fkey" FOREIGN KEY ("A") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LevelToNewsletter" ADD CONSTRAINT "_LevelToNewsletter_B_fkey" FOREIGN KEY ("B") REFERENCES "newsletters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
