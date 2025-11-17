/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "products_type_key" ON "products"("type");
