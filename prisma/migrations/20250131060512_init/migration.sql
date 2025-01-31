-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "authHeader" TEXT,
ADD COLUMN     "xpath" TEXT NOT NULL DEFAULT '//html';
