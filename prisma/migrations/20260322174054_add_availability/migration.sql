-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('DAY', 'NIGHT', 'BOTH');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "availability" "Availability" NOT NULL DEFAULT 'BOTH';
