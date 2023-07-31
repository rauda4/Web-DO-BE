-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "tittle" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_tittle_key" ON "Product"("tittle");
