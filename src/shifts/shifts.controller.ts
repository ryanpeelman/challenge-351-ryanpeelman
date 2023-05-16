import { Controller, Get, Param, Query } from "@nestjs/common";
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

  // http://localhost:3000/shifts/facility/2/shifts?start=2023-05-15T06:00:00&end=2023-05-22T06:00:00
  @Get("facility/:facilityId/shifts?")
  async getShifts(
    @Param("facilityId") facilityId: number,
    @Query("start") start: string,
    @Query("end") end: string,
    @Query("workerId") workerId?: number
  ): Promise<ShiftModel[]> {
    const facility = await this.facilitiesRepository.getById(facilityId);

    let shifts = [];

    if (!workerId) {
      shifts = await this.shiftsService.getShiftsForFacility(
        facility,
        new Date(start),
        new Date(end)
      );
    } else {
      const worker = await this.workerRepository.getById(workerId);
      shifts = await this.shiftsService.getShiftsForWorkerByFacility(
        worker,
        facility,
        new Date(start),
        new Date(end)
      );
    }

    return shifts;
  }
}
