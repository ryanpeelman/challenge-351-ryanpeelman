import { Controller, Get, Param } from "@nestjs/common";
import { WorkerModel } from "../data/models";
import { WorkersRepository } from "./workers.repository";

@Controller("workers")
export class WorkersController {
  constructor(private readonly workersRepository: WorkersRepository) {}

  @Get()
  async getAll(): Promise<WorkerModel[]> {
    const workers = await this.workersRepository.getAll();
    return workers;
  }

  @Get(":id")
  async getById(@Param("id") id: number): Promise<WorkerModel> {
    const worker = await this.workersRepository.getById(id);
    return worker;
  }
}
