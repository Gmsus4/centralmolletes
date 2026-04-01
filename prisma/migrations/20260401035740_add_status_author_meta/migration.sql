-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "author" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "metaDescription" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'published';
