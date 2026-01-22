-- AlterTable
ALTER TABLE "conversions" ADD COLUMN     "reasonId" INTEGER;

-- CreateTable
CREATE TABLE "reasons" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "reasons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "conversions" ADD CONSTRAINT "conversions_reasonId_fkey" FOREIGN KEY ("reasonId") REFERENCES "reasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
