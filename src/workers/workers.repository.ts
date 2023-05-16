import { Injectable } from "@nestjs/common";
import { WorkerModel } from "../data/models";
import { PrismaService } from "../prisma.service";

interface IRepository {
  getAll(): Promise<WorkerModel[]>;
  getById(workerId: number): Promise<WorkerModel>;
}

@Injectable()
export class WorkersRepository implements IRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<WorkerModel[]> {
    const workers = await this.prisma.worker.findMany();
    return workers;
  }

  async getById(workerId: number): Promise<WorkerModel> {
    const workers = await this.prisma.worker.findFirst({
      where: {
        id: {
          equals: workerId,
        },
      },
    });
    return workers;
  }
}

@Injectable()
export class TestWorkersRepository implements IRepository {
  async getAll(): Promise<WorkerModel[]> {
    const workers = [];
    return workers;
  }

  async getById(workerId: number): Promise<WorkerModel> {
    const workers = await this.getAll();
    return workers.find((x) => x.id === workerId);
  }
}
