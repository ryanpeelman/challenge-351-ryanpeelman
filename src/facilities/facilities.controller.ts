import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { FacilityModel } from "src/data/models";
import { RequestPerformanceInterceptor } from "../requestperformance.interceptor";
import { FacilitiesRepository } from "./facilities.repository";

@Controller("facilities")
@UseInterceptors(RequestPerformanceInterceptor)
export class FacilitiesController {
  constructor(private readonly facilitiesRepository: FacilitiesRepository) {}

  @Get()
  @ApiOperation({ summary: "Retrieve all Facility entities" })
  @ApiResponse({
    status: 200,
    description: "All Facility entities",
  })
  async getAll(): Promise<FacilityModel[]> {
    const facilities = await this.facilitiesRepository.getAll();
    return facilities;
  }

  @Get(":id")
  @ApiOperation({ summary: "Retrieve a Facility entity" })
  @ApiParam({
    name: "id",
    description: "The ID of the Facility entity",
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "A single Facility entity with the given ID",
  })
  async getById(@Param("id") id: number): Promise<FacilityModel> {
    const facility = await this.facilitiesRepository.getById(id);
    return facility;
  }
}
