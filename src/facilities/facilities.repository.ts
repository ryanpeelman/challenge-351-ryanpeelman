import { Injectable } from "@nestjs/common";
import { FacilityBuilder } from "../data/builders/facilityBuilder";
import { FacilityModel } from "../data/models";
import { PrismaService } from "../prisma.service";

interface IRepository {
  getAll(): Promise<FacilityModel[]>;
  getById(facilityId: number): Promise<FacilityModel>;
  mutateFacility(facility: FacilityModel);
}

@Injectable()
export class FacilitiesRepository implements IRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<FacilityModel[]> {
    const facilities = await this.prisma.facility.findMany();
    return facilities;
  }

  async getById(facilityId: number): Promise<FacilityModel> {
    const facilities = await this.prisma.worker.findFirst({
      where: {
        id: {
          equals: facilityId,
        },
      },
    });

    return facilities;
  }

  mutateFacility(facility: FacilityModel) {}
}

@Injectable()
export class TestFacilitiesRepository implements IRepository {
  private facilities: FacilityModel[];

  async getAll(): Promise<FacilityModel[]> {
    return this.facilities;
  }

  async getById(facilityId: number): Promise<FacilityModel> {
    const facilities = await this.getAll();
    return facilities.find((x) => x.id === facilityId);
  }

  mutateFacility(facilityToUpdate: FacilityModel) {
    this.facilities = [
      ...this.facilities.filter((s) => s.id != facilityToUpdate.id),
      facilityToUpdate,
    ];
  }

  seedScenarios() {
    //seed an inactive facility
    const inactiveFacility = new FacilityBuilder()
      .withId(0)
      .isActive(false)
      .build();

    //seed an active facility
    const activeFacility = new FacilityBuilder()
      .withId(1)
      .isActive(true)
      .build();

    this.facilities = [inactiveFacility, activeFacility];
  }
}
