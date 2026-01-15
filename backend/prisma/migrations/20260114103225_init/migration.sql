-- CreateTable
CREATE TABLE "conversions" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "base_currency" VARCHAR(3) NOT NULL,
    "target_currency" VARCHAR(3) NOT NULL,
    "converted_amount" DECIMAL(18,2) NOT NULL,
    "conversion_rate" DECIMAL(18,6) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversions_pkey" PRIMARY KEY ("id")
);
