import { Profession } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { DocumentWorkerModel, ShiftModel, WorkerModel } from "../models";

export class WorkerBuilder {
  private documents: DocumentWorkerModel[] = [];
  private id: number;
  private is_active: boolean = false;
  private name: string = "TestWorker";
  private profession: Profession = "CNA";
  private shifts: ShiftModel[] = [];

  build(): WorkerModel {
    const model: WorkerModel = {
      id: this.id ?? uuidv4(),
      name: this.name,
      is_active: this.is_active,
      profession: this.profession,
      shifts: this.shifts,
      documents: this.documents,
    };

    return model;
  }

  isActive(active: boolean): WorkerBuilder {
    this.is_active = active;
    return this;
  }

  withDocuments(documents: DocumentWorkerModel[]): WorkerBuilder {
    this.documents = documents;
    return this;
  }

  withId(id: number): WorkerBuilder {
    this.id = id;
    return this;
  }

  withName(name: string): WorkerBuilder {
    this.name = name;
    return this;
  }

  withProfession(profession: Profession): WorkerBuilder {
    this.profession = profession;
    return this;
  }

  withShifts(shifts: ShiftModel[]): WorkerBuilder {
    this.shifts = shifts;
    return this;
  }
}
