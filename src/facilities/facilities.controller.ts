import { Controller, Get, Param } from "@nestjs/common";
import { FacilitiesRepository } from "./facilities.repository";
import { FacilityModel } from "src/data/models";

@Controller("facilities")
export class FacilitiesController {
  constructor(private readonly facilitiesRepository: FacilitiesRepository) {}

  @Get()
  async getAll(): Promise<FacilityModel[]> {
    const facilities = await this.facilitiesRepository.getAll();
    return facilities;
  }

  @Get(":id")
  async getById(@Param("id") id: number): Promise<FacilityModel> {
    const facility = await this.facilitiesRepository.getById(id);
    return facility;
  }
}
