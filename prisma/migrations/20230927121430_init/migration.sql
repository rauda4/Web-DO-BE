-- CreateTable
CREATE TABLE "paymentDiamond" (
    "id" SERIAL NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "serverId" INTEGER NOT NULL,
    "nameDiamond" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "payment" TEXT NOT NULL,

    CONSTRAINT "paymentDiamond_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "paymentDiamond_zoneId_key" ON "paymentDiamond"("zoneId");
