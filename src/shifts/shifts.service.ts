import { Injectable, Logger } from '@nestjs/common';
import { FacilityModel, ShiftModel, WorkerModel } from '../data/models';
import { ShiftsRepository } from './shifts.repository';

@Injectable()
export class ShiftsService {
  private logger: Logger;
  private repostiory: ShiftsRepository;

  constructor(repository: ShiftsRepository) {
    this.logger = new Logger();
    this.repostiory = repository;
  }

  async getShiftsForWorkerByFacility(
    worker: WorkerModel,
    facility: FacilityModel,
    start: Date,
    end: Date,
  ): Promise<ShiftModel[]> {
    if (!worker.is_active) {
      this.logger.log(
        `Worker ${
          worker.name ?? worker.id
        } is not active; unable to return any shifts.`,
      );
      return [];
    }

    const workerDocumentIds = worker.documents.map((d) => d.document_id);
    if (
      !facility.requirements.every((x) =>
        workerDocumentIds.includes(x.document_id),
      )
    ) {
      this.logger.log(
        `Worker ${
          worker.name ?? worker.id
        } did not have all the documents required by the facility; unable to return any shifts.`,
      );
      return [];
    }

    const possibleShifts = await this.getShiftsForFacility(
      facility,
      start,
      end,
    );

    const currentShifts = worker.shifts;
    return possibleShifts.reduce((accumulator, possibleShift) => {
      if (possibleShift.worker_id || possibleShift.worker) {
        return accumulator;
      }

      if (possibleShift.profession != worker.profession) {
        return accumulator;
      }

      if (
        currentShifts.every(
          (s) =>
            !this.isWithinDateRange(possibleShift.start, s.start, s.end) &&
            !this.isWithinDateRange(possibleShift.end, s.start, s.end),
        )
      ) {
        accumulator.push(possibleShift);
      }

      return accumulator;
    }, []);
  }

  async getShiftsForFacility(
    facility: FacilityModel,
    start: Date,
    end: Date,
  ): Promise<ShiftModel[]> {
    if (!facility.is_active) {
      this.logger.log(
        `Facility ${
          facility.name ?? facility.id
        } is not active; unable to return any shifts.`,
      );
      return [];
    }

    const allShifts = await this.repostiory.getAll();

    const allPossibleShifts = allShifts.filter(
      (s) => s.facility_id === facility.id,
    );

    const shifts = allPossibleShifts.filter(
      (shift) =>
        this.isWithinDateRange(shift.start, start, end) &&
        this.isWithinDateRange(shift.end, start, end),
    );

    return shifts;
  }

  isWithinDateRange(check: Date, start: Date, end: Date): boolean {
    const startTime = start.getTime();
    const endTime = end.getTime();

    const checkTime = check.getTime();

    return startTime <= checkTime && checkTime <= endTime;
  }
}
