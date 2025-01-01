/*
  Warnings:

  - You are about to drop the column `prompt` on the `Url` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Url" DROP COLUMN "prompt",
ADD COLUMN     "notifyIf" TEXT;
