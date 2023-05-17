import { Module } from "@nestjs/common";
import { FacilitiesController } from "./facilities/facilities.controller";
import { FacilitiesRepository } from "./facilities/facilities.repository";
import { PrismaService } from "./prisma.service";
import { ShiftsController } from "./shifts/shifts.controller";
import { ShiftsRepository } from "./shifts/shifts.repository";
import { ShiftsService } from "./shifts/shifts.service";
import { WorkersController } from "./workers/workers.controller";
import { WorkersRepository } from "./workers/workers.repository";

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
