import { Injectable, Logger } from "@nestjs/common";
import { ShiftBuilder } from "../data/builders/shiftBuilder";
import { FacilityModel, ShiftModel, WorkerModel } from "../data/models";
import { FacilitiesRepository } from "../facilities/facilities.repository";
import { PrismaService } from "../prisma.service";
import { isWithinDateRange } from "./shifts.utilities";

interface IRepository {
  claimShift(shift: ShiftModel, worker: WorkerModel);
  getAll(): Promise<ShiftModel[]>;
  getByDateRange(start: Date, end: Date): Promise<ShiftModel[]>;
  mutateShift(shift: ShiftModel);
}

@Injectable()
export class ShiftsRepository implements IRepository {
  private logger: Logger;

  constructor(private readonly prisma: PrismaService) {
    this.logger = new Logger();
  }

  claimShift(shift: ShiftModel, worker: WorkerModel) {
    //Note: This should be implemented using a standard update pattern for Prisma.
  }

  async getAll(): Promise<ShiftModel[]> {
    // No...
    // const shifts = this.prisma.shift.findMany({ include: { facility: true } });
    // return shifts;

    //Note: Provide better guidance on this
    this.logger.log("Please use a more granular query method!");
    return [];
  }

  async getByDateRange(
    start: Date,
    end: Date,
    facilityId?: number,
    page: number = 0
  ): Promise<ShiftModel[]> {
    const pageSize = 1000;

    const dateFilters = [
      {
        start: {
          gte: start,
        },
      },
      {
        end: {
          lte: end,
        },
      },
    ];
    const where = !!facilityId
      ? {
          AND: [...dateFilters, { facility_id: parseInt(`${facilityId}`) }],
        }
      : {
          AND: [...dateFilters],
        };

    const shifts = this.prisma.shift.findMany({
      include: { facility: true },
      where: where,
      skip: page * pageSize,
      take: pageSize,
    });

    return shifts;
  }

  mutateShift(shift: ShiftModel) {
    //Note: This should be implemented using a standard update pattern for Prisma.
  }
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

  async getByDateRange(start: Date, end: Date): Promise<ShiftModel[]> {
    return this.shifts.filter(
      (s) =>
        isWithinDateRange(s.start, start, end) &&
        isWithinDateRange(s.end, start, end)
    );
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
            new Date("2023-05-15T06:00:00"),
            new Date("2023-05-15T14:00:00")
          )
          .withProfession("CNA")
          .build(),
        shiftBuilder
          .withFacility(facility)
          .withDates(
            new Date("2023-05-16T06:00:00"),
            new Date("2023-05-16T14:00:00")
          )
          .withProfession("CNA")
          .build(),
        shiftBuilder
          .withFacility(facility)
          .withDates(
            new Date("2023-05-17T06:00:00"),
            new Date("2023-05-17T14:00:00")
          )
          .withProfession("CNA")
          .build(),
        shiftBuilder
          .withFacility(facility)
          .withDates(
            new Date("2023-05-18T06:00:00"),
            new Date("2023-05-18T14:00:00")
          )
          .withProfession("CNA")
          .build(),
        shiftBuilder
          .withFacility(facility)
          .withDates(
            new Date("2023-05-19T06:00:00"),
            new Date("2023-05-19T14:00:00")
          )
          .withProfession("CNA")
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
