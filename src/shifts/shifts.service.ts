import { Injectable, Logger } from "@nestjs/common";
import { Dictionary, values } from "lodash";
import { FacilityModel, ShiftModel, WorkerModel } from "../data/models";
import { ShiftsRepository } from "./shifts.repository";
import { groupByDate, isWithinDateRange } from "./shifts.utilities";

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
    end: Date
  ): Promise<Dictionary<ShiftModel[]>> {
    if (!worker.is_active) {
      this.logger.log(
        `Worker ${
          worker.name ?? worker.id
        } is not active; unable to return any shifts.`
      );
      return {};
    }

    const workerDocumentIds = worker.documents?.map((d) => d.document_id) ?? [];
    if (
      facility.requirements?.length &&
      !facility.requirements.every((x) =>
        workerDocumentIds.includes(x.document_id)
      )
    ) {
      this.logger.log(
        `Worker ${
          worker.name ?? worker.id
        } did not have all the documents required by the facility; unable to return any shifts.`
      );
      return {};
    }

    const possibleShifts = await this.getShiftsForFacility(
      facility,
      start,
      end
    );

    const flattenedPossibleShifts = values(possibleShifts).flat();

    const currentShifts = worker.shifts ?? [];
    const shifts = flattenedPossibleShifts.reduce(
      (accumulator, possibleShift) => {
        if (possibleShift.worker_id || possibleShift.worker) {
          return accumulator;
        }

        if (possibleShift.profession != worker.profession) {
          return accumulator;
        }

        if (
          currentShifts.every(
            (s) =>
              !isWithinDateRange(possibleShift.start, s.start, s.end) &&
              !isWithinDateRange(possibleShift.end, s.start, s.end)
          )
        ) {
          accumulator.push(possibleShift);
        }

        return accumulator;
      },
      []
    );

    return groupByDate(shifts);
  }

  async getShiftsForFacility(
    facility: FacilityModel,
    start: Date,
    end: Date
  ): Promise<Dictionary<ShiftModel[]>> {
    if (!facility.is_active) {
      this.logger.log(
        `Facility ${
          facility.name ?? facility.id
        } is not active; unable to return any shifts.`
      );
      return {};
    }

    const allShifts = await this.repostiory.getByDateRange(
      start,
      end,
      facility.id
    );

    const allPossibleShifts = allShifts.filter((s) => !s.is_deleted);

    const shifts = allPossibleShifts.filter(
      (shift) =>
        isWithinDateRange(shift.start, start, end) &&
        isWithinDateRange(shift.end, start, end)
    );

    return groupByDate(shifts);
  }
}
