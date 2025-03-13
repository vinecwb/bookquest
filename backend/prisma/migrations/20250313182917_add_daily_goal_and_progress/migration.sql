/*
  Warnings:

  - You are about to drop the column `dailyGoal` on the `BookUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BookUser" DROP COLUMN "dailyGoal";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dailyGoal" INTEGER NOT NULL DEFAULT 10;
