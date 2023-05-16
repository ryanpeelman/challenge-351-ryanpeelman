import { Module } from "@nestjs/common";
import { ShiftsController } from "./shifts/shifts.controller";
import { ShiftsRepository } from "./shifts/shifts.repository";
import { ShiftsService } from "./shifts/shifts.service";
import { FacilitiesRepository } from "./facilities/facilities.repository";
import { FacilitiesController } from "./facilities/facilities.controller";
import { WorkersController } from "./workers/workers.controller";
import { WorkersRepository } from "./workers/workers.repository";
import { PrismaService } from "./prisma.service";

@Module({
  imports: [],
  controllers: [ShiftsController, FacilitiesController, WorkersController],
  providers: [
    FacilitiesRepository,
    PrismaService,
    ShiftsRepository,
    ShiftsService,
    WorkersRepository,
  ],
})
export class AppModule {}
