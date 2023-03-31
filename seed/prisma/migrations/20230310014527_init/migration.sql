-- CreateEnum
CREATE TYPE "Profession" AS ENUM ('CNA', 'LVN', 'RN');

-- CreateTable
CREATE TABLE "Worker" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "profession" "Profession" NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacilityRequirement" (
    "id" SERIAL NOT NULL,
    "facility_id" INTEGER NOT NULL,
    "document_id" INTEGER NOT NULL,

    CONSTRAINT "FacilityRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentWorker" (
    "id" SERIAL NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "document_id" INTEGER NOT NULL,

    CONSTRAINT "DocumentWorker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" SERIAL NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "profession" "Profession" NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "facility_id" INTEGER NOT NULL,
    "worker_id" INTEGER,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FacilityRequirement" ADD CONSTRAINT "FacilityRequirement_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacilityRequirement" ADD CONSTRAINT "FacilityRequirement_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentWorker" ADD CONSTRAINT "DocumentWorker_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentWorker" ADD CONSTRAINT "DocumentWorker_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
