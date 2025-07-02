/*
  Warnings:

  - Made the column `nome` on table `Tag` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PMOC" ADD COLUMN     "contrato" TEXT;

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "nome" SET NOT NULL;
