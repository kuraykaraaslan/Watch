-- AlterTable
ALTER TABLE "Snapshot" ADD COLUMN     "changelog" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "content" TEXT NOT NULL DEFAULT '';
