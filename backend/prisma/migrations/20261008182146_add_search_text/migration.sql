-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "searchText" TEXT;

-- CreateIndex
CREATE INDEX "Product_searchText_idx" ON "Product"("searchText");
