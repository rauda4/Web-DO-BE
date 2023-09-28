/*
  Warnings:

  - The primary key for the `paymentDiamond` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `paymentDiamond` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "paymentDiamond" DROP CONSTRAINT "paymentDiamond_pkey",
DROP COLUMN "id",
ADD COLUMN     "order_id" SERIAL NOT NULL,
ADD CONSTRAINT "paymentDiamond_pkey" PRIMARY KEY ("order_id");
