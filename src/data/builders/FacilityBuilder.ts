import { v4 as uuidv4 } from "uuid";
import { FacilityModel, FacilityRequirementModel, ShiftModel } from "../models";

export class FacilityBuilder {
  private id: number;
  private is_active: boolean = false;
  private name: string = "TestFacility";
  private requirements: FacilityRequirementModel[] = [];
  private shifts: ShiftModel[] = [];

  build(): FacilityModel {
    const model: FacilityModel = {
      id: this.id ?? uuidv4(),
      name: this.name,
      is_active: this.is_active,
      requirements: this.requirements,
      shifts: this.shifts,
    };

    return model;
  }

  isActive(active: boolean): FacilityBuilder {
    this.is_active = active;
    return this;
  }

  withId(id: number): FacilityBuilder {
    this.id = id;
    return this;
  }

  withName(name: string): FacilityBuilder {
    this.name = name;
    return this;
  }

  withRequirements(requirements: FacilityRequirementModel[]): FacilityBuilder {
    this.requirements = requirements;
    return this;
  }

  withShifts(shifts: ShiftModel[]): FacilityBuilder {
    this.shifts = shifts;
    return this;
  }
}
