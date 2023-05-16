import { Controller, Get, Param } from "@nestjs/common";
import { ShiftModel } from "../data/models";
import { FacilitiesRepository } from "../facilities/facilities.repository";
import { ShiftsService } from "./shifts.service";
import { WorkersRepository } from "../workers/workers.repository";

@Controller("shifts")
export class ShiftsController {
  constructor(
    private readonly shiftsService: ShiftsService,
    private readonly facilitiesRepository: FacilitiesRepository,
    private readonly workerRepository: WorkersRepository
  ) {}

  @Get("facility/:facilityId/shifts")
  async getShifts(
    @Param("facilityId") facilityId: number,
    @Param("start") start: Date,
    @Param("end") end: Date,
    @Param("workerId") workerId?: number
  ): Promise<ShiftModel[]> {
    const facility = await this.facilitiesRepository.getById(facilityId);

    let shifts = [];

    if (!workerId) {
      shifts = await this.shiftsService.getShiftsForFacility(
        facility,
        start,
        end
      );
    } else {
      const worker = await this.workerRepository.getById(workerId);
      shifts = await this.shiftsService.getShiftsForWorkerByFacility(
        worker,
        facility,
        start,
        end
      );
    }

    return shifts;
  }
}
