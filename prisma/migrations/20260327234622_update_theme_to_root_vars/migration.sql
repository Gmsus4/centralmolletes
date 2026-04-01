/*
  Warnings:

  - You are about to drop the column `background` on the `Theme` table. All the data in the column will be lost.
  - You are about to drop the column `border` on the `Theme` table. All the data in the column will be lost.
  - You are about to drop the column `card` on the `Theme` table. All the data in the column will be lost.
  - You are about to drop the column `cardForeground` on the `Theme` table. All the data in the column will be lost.
  - You are about to drop the column `foreground` on the `Theme` table. All the data in the column will be lost.
  - You are about to drop the column `input` on the `Theme` table. All the data in the column will be lost.
  - You are about to drop the column `muted` on the `Theme` table. All the data in the column will be lost.
  - You are about to drop the column `mutedForeground` on the `Theme` table. All the data in the column will be lost.
  - You are about to drop the column `primary` on the `Theme` table. All the data in the column will be lost.
  - You are about to drop the column `primaryForeground` on the `Theme` table. All the data in the column will be lost.
  - You are about to drop the column `ring` on the `Theme` table. All the data in the column will be lost.
  - You are about to drop the column `secondary` on the `Theme` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryForeground` on the `Theme` table. All the data in the column will be lost.
  - You are about to drop the `Website` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bgBody` to the `Theme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bgDark` to the `Theme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `borderColor` to the `Theme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brandContrast` to the `Theme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brandContrastHover` to the `Theme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brandPrimary` to the `Theme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brandPrimaryHover` to the `Theme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shadowColor` to the `Theme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusError` to the `Theme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textInvert` to the `Theme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textMain` to the `Theme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textMuted` to the `Theme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textTitles` to the `Theme` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Website" DROP CONSTRAINT "Website_themeId_fkey";

-- AlterTable
ALTER TABLE "Theme" DROP COLUMN "background",
DROP COLUMN "border",
DROP COLUMN "card",
DROP COLUMN "cardForeground",
DROP COLUMN "foreground",
DROP COLUMN "input",
DROP COLUMN "muted",
DROP COLUMN "mutedForeground",
DROP COLUMN "primary",
DROP COLUMN "primaryForeground",
DROP COLUMN "ring",
DROP COLUMN "secondary",
DROP COLUMN "secondaryForeground",
ADD COLUMN     "bgBody" TEXT NOT NULL,
ADD COLUMN     "bgDark" TEXT NOT NULL,
ADD COLUMN     "borderColor" TEXT NOT NULL,
ADD COLUMN     "brandContrast" TEXT NOT NULL,
ADD COLUMN     "brandContrastHover" TEXT NOT NULL,
ADD COLUMN     "brandPrimary" TEXT NOT NULL,
ADD COLUMN     "brandPrimaryHover" TEXT NOT NULL,
ADD COLUMN     "shadowColor" TEXT NOT NULL,
ADD COLUMN     "statusError" TEXT NOT NULL,
ADD COLUMN     "textInvert" TEXT NOT NULL,
ADD COLUMN     "textMain" TEXT NOT NULL,
ADD COLUMN     "textMuted" TEXT NOT NULL,
ADD COLUMN     "textTitles" TEXT NOT NULL;

-- DropTable
DROP TABLE "Website";
