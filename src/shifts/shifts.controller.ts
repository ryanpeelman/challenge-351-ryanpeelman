import { Controller, Get, Param, Query, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { Dictionary } from "lodash";
import { ShiftModel } from "../data/models";
import { FacilitiesRepository } from "../facilities/facilities.repository";
import { RequestPerformanceInterceptor } from "../requestperformance.interceptor";
import { WorkersRepository } from "../workers/workers.repository";
import { ShiftsRepository } from "./shifts.repository";
import { ShiftsService } from "./shifts.service";
import { groupByDate } from "./shifts.utilities";

@Controller("shifts")
@UseInterceptors(RequestPerformanceInterceptor)
export class ShiftsController {
  constructor(
    private readonly shiftsService: ShiftsService,
    private readonly shiftsRepository: ShiftsRepository,
    private readonly facilitiesRepository: FacilitiesRepository,
    private readonly workerRepository: WorkersRepository
  ) {}

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
    description: "A list of Shifts, grouped by date",
  })
  async getShifts(
    @Param("facilityId") facilityId: number,
    @Query("start") start: string,
    @Query("end") end: string,
    @Query("workerId") workerId?: number
  ): Promise<Dictionary<ShiftModel[]>> {
    const facility = await this.facilitiesRepository.getById(facilityId);

    let shifts = {};

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

  @Get()
  @ApiOperation({
    summary: "Retrieve all Shifts between a given date range",
  })
  @ApiQuery({
    name: "facilityId",
    description: "The ID of the Facility entity",
    required: false,
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
  @ApiResponse({
    status: 200,
    description: "A list of Shifts, grouped by date",
  })
  async getShiftsByDateRange(
    @Query("start") start: string,
    @Query("end") end: string,
    @Query("facilityId") facilityId?: number
  ): Promise<Dictionary<ShiftModel[]>> {
    const shifts = await this.shiftsRepository.getByDateRange(
      new Date(start),
      new Date(end),
      facilityId
    );
    return groupByDate(shifts);
  }
}
