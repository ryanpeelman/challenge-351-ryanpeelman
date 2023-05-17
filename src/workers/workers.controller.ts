import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { WorkerModel } from "../data/models";
import { RequestPerformanceInterceptor } from "../requestperformance.interceptor";
import { WorkersRepository } from "./workers.repository";

@Controller("workers")
@UseInterceptors(RequestPerformanceInterceptor)
export class WorkersController {
  constructor(private readonly workersRepository: WorkersRepository) {}

  @Get()
  @ApiOperation({ summary: "Retrieve all Worker entities" })
  @ApiResponse({
    status: 200,
    description: "All Worker entities",
  })
  async getAll(): Promise<WorkerModel[]> {
    const workers = await this.workersRepository.getAll();
    return workers;
  }

  @Get(":id")
  @ApiOperation({ summary: "Retrieve a Worker entity" })
  @ApiParam({
    name: "id",
    description: "The ID of the Worker entity",
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "A single Worker entity with the given ID",
  })
  async getById(@Param("id") id: number): Promise<WorkerModel> {
    const worker = await this.workersRepository.getById(id);
    return worker;
  }
}
