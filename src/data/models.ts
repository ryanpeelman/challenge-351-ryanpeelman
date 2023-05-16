import { Profession, Worker } from "@prisma/client";

export type DocumentModel = {
  id: number;
  name: string;
  is_active: boolean;
  requirements?: FacilityRequirementModel[];
  workers?: DocumentWorkerModel[];
};

export type DocumentWorkerModel = {
  id: number;
  worker_id: number;
  document_id: number;
  worker: WorkerModel;
  document: DocumentModel;
};

export type FacilityModel = {
  id: number;
  name: string;
  is_active: boolean;
  requirements?: FacilityRequirementModel[];
  shifts?: ShiftModel[];
};

export type FacilityRequirementModel = {
  id: number;
  facility_id: number;
  document_id: number;
  facility: FacilityModel;
  document: DocumentModel;
};

export type ShiftModel = {
  id: number;
  start: Date;
  end: Date;
  profession: Profession;
  is_deleted: boolean;
  facility_id: number;
  worker_id?: number;
  worker?: WorkerModel;
  facility: FacilityModel;
};

export type WorkerModel = {
  id: number;
  name: string;
  is_active: boolean;
  profession: Profession;
  shifts?: ShiftModel[];
  documents?: DocumentWorkerModel[];
};
