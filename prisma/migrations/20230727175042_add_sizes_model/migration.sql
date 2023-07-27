-- CreateTable
CREATE TABLE "Size" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storeId" TEXT NOT NULL,

    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Size_storeId_idx" ON "Size"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "Size_storeId_name_key" ON "Size"("storeId", "name");
