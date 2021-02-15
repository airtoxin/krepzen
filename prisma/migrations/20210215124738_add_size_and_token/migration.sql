/*
  Warnings:

  - Added the required column `size` to the `Krepzen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `Krepzen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Krepzen" ADD COLUMN     "size" INTEGER NOT NULL,
ADD COLUMN     "token" TEXT NOT NULL;
