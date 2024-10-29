/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Room` table. All the data in the column will be lost.
  - The primary key for the `UserRoom` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserRoom` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'MEMBER');

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_ownerId_fkey";

-- DropIndex
DROP INDEX "Room_ownerId_key";

-- DropIndex
DROP INDEX "UserRoom_userId_roomId_key";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "ownerId";

-- AlterTable
ALTER TABLE "UserRoom" DROP CONSTRAINT "UserRoom_pkey",
DROP COLUMN "id",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
ADD CONSTRAINT "UserRoom_pkey" PRIMARY KEY ("userId", "roomId");
