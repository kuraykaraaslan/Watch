-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "aiEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "prompt" TEXT;
