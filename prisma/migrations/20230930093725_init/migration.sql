/*
  Warnings:

  - The primary key for the `paymentDiamond` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `zoneId` on the `paymentDiamond` table. All the data in the column will be lost.
  - Added the required column `stock` to the `diamond` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameId` to the `paymentDiamond` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `paymentDiamond` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `stock` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "diamond" ADD COLUMN     "stock" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "paymentDiamond" DROP CONSTRAINT "paymentDiamond_pkey",
DROP COLUMN "zoneId",
ADD COLUMN     "gameId" INTEGER NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "paymentDiamond_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "stock" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "paymentProduct" (
    "order_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "payment" TEXT NOT NULL,

    CONSTRAINT "paymentProduct_pkey" PRIMARY KEY ("order_id")
);
