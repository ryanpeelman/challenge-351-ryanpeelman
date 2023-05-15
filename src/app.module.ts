import { Module } from '@nestjs/common';
import { ShiftsController } from './shifts/shifts.controller';
import { ShiftsRepository } from './shifts/shifts.repository';
import { ShiftsService } from './shifts/shifts.service';
import { FacilitiesRepository } from './facilities/facilities.repository';
import { FacilitiesController } from './facilities/facilities.controller';

@Module({
  imports: [],
  controllers: [ShiftsController, FacilitiesController],
  providers: [FacilitiesRepository, ShiftsRepository, ShiftsService],
})
export class AppModule {}
