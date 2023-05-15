import { Injectable } from "@nestjs/common";
import { WorkerModel } from "src/data/models";

interface IRepository {
  getAll(): Promise<WorkerModel[]>;
  getById(workerId: number): Promise<WorkerModel>;
}

@Injectable()
export class WorkersRepository implements IRepository {
  async getAll(): Promise<WorkerModel[]> {
    const workers = [];
    return workers;
  }

  async getById(workerId: number): Promise<WorkerModel> {
    const workers = await this.getAll();
    return workers.find((x) => x.id === workerId);
  }
}
