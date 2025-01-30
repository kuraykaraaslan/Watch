/*
  Warnings:

  - You are about to drop the column `url` on the `Url` table. All the data in the column will be lost.
  - Added the required column `link` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Url" DROP COLUMN "url",
ADD COLUMN     "link" TEXT NOT NULL;
