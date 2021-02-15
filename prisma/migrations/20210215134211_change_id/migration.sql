/*
  Warnings:

  - The migration will change the primary key for the `Krepzen` table. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Krepzen" DROP CONSTRAINT "Krepzen_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "Krepzen_id_seq";
