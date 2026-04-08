-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('visible', 'hidden');

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "photo" TEXT,
    "rating" INTEGER NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'visible',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);
