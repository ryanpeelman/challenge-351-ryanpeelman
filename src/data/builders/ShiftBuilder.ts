import { Profession } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { FacilityModel, ShiftModel } from "../models";

export class ShiftBuilder {
  private facility: FacilityModel;
  private end: Date;
  private id: number;
  private is_deleted: boolean = false;
  private profession: Profession = "CNA";
  private start: Date;

  build(): ShiftModel {
    const model: ShiftModel = {
      id: this.id ?? uuidv4(),
      start: this.start,
      end: this.end,
      profession: this.profession,
      is_deleted: this.is_deleted,
      facility_id: this.facility.id,
      facility: this.facility,
    };

    return model;
  }

  isDeleted(deleted: boolean): ShiftBuilder {
    this.is_deleted = deleted;
    return this;
  }

  withDates(start: Date, end: Date): ShiftBuilder {
    this.start = start;
    this.end = end;
    return this;
  }

  withFacility(facility: FacilityModel): ShiftBuilder {
    this.facility = facility;
    return this;
  }

  withId(id: number): ShiftBuilder {
    this.id = id;
    return this;
  }

  withProfession(profession: Profession): ShiftBuilder {
    this.profession = profession;
    return this;
  }
}
