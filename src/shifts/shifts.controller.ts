import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { ShiftModel } from "../data/models";
import { FacilitiesRepository } from "../facilities/facilities.repository";
import { WorkersRepository } from "../workers/workers.repository";
import { ShiftsService } from "./shifts.service";

@Controller("shifts")
export class ShiftsController {
  constructor(
    private readonly shiftsService: ShiftsService,
    private readonly facilitiesRepository: FacilitiesRepository,
    private readonly workerRepository: WorkersRepository
  ) {}

  // http://localhost:3000/shifts/facility/2/shifts?start=2023-05-15T06:00:00&end=2023-05-22T06:00:00
  @Get("facility/:facilityId/shifts?")
  @ApiOperation({
    summary:
      "Retrieve all available Shifts at the given Facility between a given date range; optionally, constrained to a specific Worker",
  })
  @ApiParam({
    name: "facilityId",
    description: "The ID of the Facility entity",
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: "start",
    description: "The date/time to start the shift search",
    required: true,
    type: String,
  })
  @ApiQuery({
    name: "end",
    description: "The date/time to end the shift search",
    required: true,
    type: String,
  })
  @ApiQuery({
    name: "workerId",
    description:
      "(Optional) The ID of the Worker to constrain the search around",
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "A list of Shifts.",
  })
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
