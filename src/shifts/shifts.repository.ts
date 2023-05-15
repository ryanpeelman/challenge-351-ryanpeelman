import { Injectable } from '@nestjs/common';
import { ShiftBuilder } from '../data/builders/shiftBuilder';
import {
  FacilityModel,
  Profession,
  ShiftModel,
  WorkerModel,
} from '../data/models';
import { FacilitiesRepository } from '../facilities/facilities.repository';

interface IRepository {
  claimShift(shift: ShiftModel, worker: WorkerModel);
  getAll(): Promise<ShiftModel[]>;
  mutateShift(shift: ShiftModel);
}

@Injectable()
export class ShiftsRepository implements IRepository {
  claimShift(shift: ShiftModel, worker: WorkerModel) {}

  async getAll(): Promise<ShiftModel[]> {
    const shifts = [];
    return shifts;
  }

  mutateShift(shift: ShiftModel) {}
}

@Injectable()
export class TestShiftsRepository implements IRepository {
  private facilitiesRepository: FacilitiesRepository;
  private shifts: ShiftModel[];

  constructor(facilitiesRepository: FacilitiesRepository) {
    this.facilitiesRepository = facilitiesRepository;
  }

  claimShift(shift: ShiftModel, worker: WorkerModel) {
    const shiftToUpdate = this.shifts.find((s) => s.id === shift.id);
    shiftToUpdate.worker = worker;
    shiftToUpdate.worker_id = worker.id;

    this.mutateShift(shiftToUpdate);
  }

  async getAll(): Promise<ShiftModel[]> {
    return this.shifts;
  }

  mutateShift(shiftToUpdate: ShiftModel) {
    this.shifts = [
      ...this.shifts.filter((s) => s.id != shiftToUpdate.id),
      shiftToUpdate,
    ];
  }

  async seedScenarios() {
    function seedShifts(facility: FacilityModel): ShiftModel[] {
      const shiftBuilder = new ShiftBuilder();
      const shifts = [
        shiftBuilder
          .withFacility(facility)
          .withDates(
            new Date('2023-05-15T06:00:00'),
            new Date('2023-05-15T14:00:00'),
          )
          .withProfession(Profession.CNA)
          .build(),
        shiftBuilder
          .withFacility(facility)
          .withDates(
            new Date('2023-05-16T06:00:00'),
            new Date('2023-05-16T14:00:00'),
          )
          .withProfession(Profession.CNA)
          .build(),
        shiftBuilder
          .withFacility(facility)
          .withDates(
            new Date('2023-05-17T06:00:00'),
            new Date('2023-05-17T14:00:00'),
          )
          .withProfession(Profession.CNA)
          .build(),
        shiftBuilder
          .withFacility(facility)
          .withDates(
            new Date('2023-05-18T06:00:00'),
            new Date('2023-05-18T14:00:00'),
          )
          .withProfession(Profession.CNA)
          .build(),
        shiftBuilder
          .withFacility(facility)
          .withDates(
            new Date('2023-05-19T06:00:00'),
            new Date('2023-05-19T14:00:00'),
          )
          .withProfession(Profession.CNA)
          .build(),
      ];

      return shifts;
    }

    this.shifts = [];

    const facilities = await this.facilitiesRepository.getAll();
    for (const facility of facilities) {
      const facilityShifts = seedShifts(facility);
      facility.shifts = facilityShifts;

      this.shifts.push(...facilityShifts);
    }
  }
}
