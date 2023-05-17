import { Test } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { ModuleMocker } from "jest-mock";
import { mockDeep } from "jest-mock-extended";
import { AppModule } from "../app.module";
import { WorkerBuilder } from "../data/builders/workerBuilder";
import { DocumentModel, FacilityRequirementModel } from "../data/models";
import {
  FacilitiesRepository,
  TestFacilitiesRepository,
} from "../facilities/facilities.repository";
import { PrismaService } from "../prisma.service";
import {
  TestWorkersRepository,
  WorkersRepository,
} from "../workers/workers.repository";
import { ShiftsRepository, TestShiftsRepository } from "./shifts.repository";
import { ShiftsService } from "./shifts.service";
import { values } from "lodash";

describe("ShiftsService", () => {
  let facilitiesRepository: TestFacilitiesRepository;
  let service: ShiftsService;
  let shiftsRepository: TestShiftsRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .overrideProvider(FacilitiesRepository)
      .useClass(TestFacilitiesRepository)
      .overrideProvider(ShiftsRepository)
      .useClass(TestShiftsRepository)
      .overrideProvider(WorkersRepository)
      .useClass(TestWorkersRepository)
      .compile();

    const app = moduleRef.createNestApplication();
    await app.init();

    facilitiesRepository = moduleRef.get(FacilitiesRepository);
    service = moduleRef.get<ShiftsService>(ShiftsService);
    shiftsRepository = moduleRef.get(ShiftsRepository);
  });

  beforeEach(async () => {
    facilitiesRepository.seedScenarios();
    shiftsRepository.seedScenarios();
  });

  describe("GIVEN an active Facility", () => {
    describe("WHEN I request all available Shifts within a start and end date", () => {
      test("THEN it will return a list of Shifts from that Facility in the specified date range", async () => {
        const facilities = await facilitiesRepository.getAll();
        const facility = facilities.find((f) => f.is_active);

        const start = new Date("2023-05-16T06:00:00");
        const end = new Date("2023-05-18T14:00:00");

        const result = await service.getShiftsForFacility(facility, start, end);

        expect(result).toBeDefined();

        const resultShifts = values(result).flat();
        expect(resultShifts.length).toBe(3);
        expect(new Date(resultShifts[0].start)).toStrictEqual(
          new Date("2023-05-16T06:00:00")
        );
        expect(new Date(resultShifts[1].start)).toStrictEqual(
          new Date("2023-05-17T06:00:00")
        );
        expect(new Date(resultShifts[2].start)).toStrictEqual(
          new Date("2023-05-18T06:00:00")
        );
      });

      describe("AND a Shift is claimed within the requested start and end date", () => {
        test("THEN it will NOT return the claimed Shift,", async () => {
          const facilities = await facilitiesRepository.getAll();
          const facility = facilities.find((f) => f.is_active);

          const allShifts = await shiftsRepository.getAll();
          const allShiftsForFacility = allShifts.filter(
            (x) => x.facility_id === facility.id
          );
          const workerClaimedShiftId = allShiftsForFacility[2].id;
          const anotherWorkerClaimedShiftId = allShiftsForFacility[1].id;

          const workerClaimedShift = allShiftsForFacility.find(
            (x) => x.id === workerClaimedShiftId
          );
          const worker = new WorkerBuilder()
            .withName("Active Worker")
            .isActive(true)
            .withShifts([workerClaimedShift])
            .build();
          shiftsRepository.claimShift(workerClaimedShift, worker);

          const anotherWorkerClaimedShift = allShiftsForFacility.find(
            (x) => x.id === anotherWorkerClaimedShiftId
          );
          const anotherWorker = new WorkerBuilder()
            .withName("Another Active Worker")
            .isActive(true)
            .withShifts([anotherWorkerClaimedShift])
            .build();
          shiftsRepository.claimShift(anotherWorkerClaimedShift, anotherWorker);

          const start = new Date("2023-05-16T06:00:00");
          const end = new Date("2023-05-18T14:00:00");

          const result = await service.getShiftsForWorkerByFacility(
            worker,
            facility,
            start,
            end
          );

          expect(result).toBeDefined();

          const resultShifts = values(result).flat();
          expect(resultShifts.length).toBe(1);
          expect(new Date(resultShifts[0].start)).toStrictEqual(
            new Date("2023-05-18T06:00:00")
          );
        });
      });
    });
  });

  describe("GIVEN an inactive Facility", () => {
    describe("WHEN I request all available Shifts within a start and end date", () => {
      test("THEN it will NOT return a list of Shifts from that Facility", async () => {
        const facilities = await facilitiesRepository.getAll();
        const facility = facilities.find((f) => !f.is_active);

        const start = new Date("2023-05-16T06:00:00");
        const end = new Date("2023-05-18T14:00:00");

        const result = await service.getShiftsForFacility(facility, start, end);

        expect(result).toBeDefined();

        const resultShifts = values(result).flat();
        expect(resultShifts.length).toBe(0);
      });
    });
  });

  describe("GIVEN an active Worker", () => {
    describe("WITH no current shifts", () => {
      describe("WHEN I request all available Shifts within a start and end date", () => {
        test("THEN it will return a list of Shifts from that Facility", async () => {
          const worker = new WorkerBuilder()
            .withName("Active Worker")
            .withProfession("CNA")
            .isActive(true)
            .build();

          const facilities = await facilitiesRepository.getAll();
          const facility = facilities.find((f) => f.is_active);

          const start = new Date("2023-05-16T06:00:00");
          const end = new Date("2023-05-18T14:00:00");

          const result = await service.getShiftsForWorkerByFacility(
            worker,
            facility,
            start,
            end
          );

          expect(result).toBeDefined();

          const resultShifts = values(result).flat();
          expect(resultShifts.length).toBe(3);
          expect(new Date(resultShifts[0].start)).toStrictEqual(
            new Date("2023-05-16T06:00:00")
          );
          expect(new Date(resultShifts[1].start)).toStrictEqual(
            new Date("2023-05-17T06:00:00")
          );
          expect(new Date(resultShifts[2].start)).toStrictEqual(
            new Date("2023-05-18T06:00:00")
          );
        });

        test("THEN it will return a list of Shifts from that Facility for my profession", async () => {
          const facilities = await facilitiesRepository.getAll();
          const facility = facilities.find((f) => f.is_active);

          const allShifts = await shiftsRepository.getAll();
          const allShiftsForFacility = allShifts.filter(
            (x) => x.facility_id === facility.id
          );

          const shiftToSwapToRN = allShiftsForFacility[1];
          shiftToSwapToRN.profession = "RN";
          shiftsRepository.mutateShift(shiftToSwapToRN);

          const worker = new WorkerBuilder()
            .withName("Active Worker")
            .withProfession("RN")
            .isActive(true)
            .build();

          const start = new Date("2023-05-16T06:00:00");
          const end = new Date("2023-05-18T14:00:00");

          const result = await service.getShiftsForWorkerByFacility(
            worker,
            facility,
            start,
            end
          );

          expect(result).toBeDefined();

          const resultShifts = values(result).flat();
          expect(resultShifts.length).toBe(1);
          expect(new Date(resultShifts[0].start)).toStrictEqual(
            new Date("2023-05-16T06:00:00")
          );
        });
      });
    });

    describe("WITH current shifts", () => {
      describe("WHEN I request all available Shifts within a start and end date", () => {
        test("THEN it will return a list of Shifts from that Facility that do not overlap with the current Shifts for that Worker", async () => {
          const facilities = await facilitiesRepository.getAll();
          const facility = facilities.find((f) => f.is_active);

          const allShifts = await shiftsRepository.getAll();
          const allShiftsForFacility = allShifts.filter(
            (x) => x.facility_id === facility.id
          );
          const workerClaimedShiftId = allShiftsForFacility[2].id;

          const workerClaimedShift = allShiftsForFacility.find(
            (x) => x.id === workerClaimedShiftId
          );
          const worker = new WorkerBuilder()
            .withName("Active Worker")
            .isActive(true)
            .withShifts([workerClaimedShift])
            .build();
          shiftsRepository.claimShift(workerClaimedShift, worker);

          const start = new Date("2023-05-16T06:00:00");
          const end = new Date("2023-05-18T14:00:00");

          const result = await service.getShiftsForWorkerByFacility(
            worker,
            facility,
            start,
            end
          );

          expect(result).toBeDefined();

          const resultShifts = values(result).flat();
          expect(resultShifts.length).toBe(2);
          expect(new Date(resultShifts[0].start)).toStrictEqual(
            new Date("2023-05-16T06:00:00")
          );
          expect(new Date(resultShifts[1].start)).toStrictEqual(
            new Date("2023-05-18T06:00:00")
          );
        });
      });
    });
  });

  describe("GIVEN an inactive Worker", () => {
    describe("WHEN I request all available Shifts within a start and end date", () => {
      test("THEN it will NOT return a list of Shifts from that Facility", async () => {
        const worker = new WorkerBuilder()
          .withName("Inactive Worker")
          .isActive(false)
          .build();

        const facilities = await facilitiesRepository.getAll();
        const facility = facilities.find((f) => f.is_active);

        const start = new Date("2023-05-16T06:00:00");
        const end = new Date("2023-05-18T14:00:00");

        const result = await service.getShiftsForWorkerByFacility(
          worker,
          facility,
          start,
          end
        );

        expect(result).toBeDefined();

        const resultShifts = values(result).flat();
        expect(resultShifts.length).toBe(0);
      });
    });
  });

  test("The Shifts must be grouped by date.", async () => {
    const facilities = await facilitiesRepository.getAll();
    const facility = facilities.find((f) => f.is_active);

    const allShifts = await shiftsRepository.getAll();
    const allShiftsForFacility = allShifts.filter(
      (x) => x.facility_id === facility.id
    );

    const shiftIds = allShiftsForFacility.map((s) => s.id).slice(0, 5);

    for (const [index, shiftId] of shiftIds.entries()) {
      const shiftToUpdate = allShiftsForFacility.find((x) => x.id === shiftId);
      shiftToUpdate.start = new Date(`2023-05-16T0${index}:00:00`);
      shiftToUpdate.end = new Date(`2023-05-16T0${index + 1}:00:00`);
      shiftsRepository.mutateShift(shiftToUpdate);
    }

    const worker = new WorkerBuilder()
      .withName("Active Worker")
      .withProfession("CNA")
      .isActive(true)
      .build();

    const start = new Date("2023-05-16T00:00:00");
    const end = new Date("2023-05-16T06:00:00");

    const result = await service.getShiftsForWorkerByFacility(
      worker,
      facility,
      start,
      end
    );

    const expectedKey = "Tue May 16 2023";
    expect(result).toBeDefined();
    expect(Object.keys(result).length).toBe(1);
    expect(Object.keys(result)[0]).toBe(expectedKey);

    const shifts = result[expectedKey];
    expect(shifts.length).toBe(5);
  });

  test("The Worker must have all the documents required by the facilities.", async () => {
    const documentA: DocumentModel = {
      id: 100,
      name: "Document A",
      is_active: true,
      requirements: [],
      workers: [],
    };

    const documentB: DocumentModel = {
      id: 200,
      name: "Document B",
      is_active: true,
      requirements: [],
      workers: [],
    };

    const worker = new WorkerBuilder()
      .withName("Active Worker")
      .withProfession("CNA")
      .isActive(true)
      .build();
    worker.documents = [
      {
        id: 8000,
        worker_id: worker.id,
        document_id: documentA.id,
        worker: worker,
        document: documentA,
      },
    ];

    const facilities = await facilitiesRepository.getAll();
    const facility = facilities.find((f) => f.is_active);

    const facilityRequirement: FacilityRequirementModel = {
      id: 9000,
      facility_id: facility.id,
      document_id: documentA.id,
      facility: facility,
      document: documentA,
    };
    facility.requirements = [facilityRequirement];

    facilitiesRepository.mutateFacility(facility);

    const start = new Date("2023-05-16T06:00:00");
    const end = new Date("2023-05-18T14:00:00");

    const result = await service.getShiftsForWorkerByFacility(
      worker,
      facility,
      start,
      end
    );

    expect(result).toBeDefined();

    const resultShifts = values(result).flat();
    expect(resultShifts.length).toBe(3);
    expect(new Date(resultShifts[0].start)).toStrictEqual(
      new Date("2023-05-16T06:00:00")
    );
    expect(new Date(resultShifts[1].start)).toStrictEqual(
      new Date("2023-05-17T06:00:00")
    );
    expect(new Date(resultShifts[2].start)).toStrictEqual(
      new Date("2023-05-18T06:00:00")
    );

    const additionalFacilityRequirement: FacilityRequirementModel = {
      id: 9001,
      facility_id: facility.id,
      document_id: documentB.id,
      facility: facility,
      document: documentB,
    };
    facility.requirements = [
      facilityRequirement,
      additionalFacilityRequirement,
    ];

    facilitiesRepository.mutateFacility(facility);

    const nextResult = await service.getShiftsForWorkerByFacility(
      worker,
      facility,
      start,
      end
    );

    expect(nextResult).toBeDefined();

    const nextResultShifts = values(nextResult).flat();
    expect(nextResultShifts.length).toBe(0);
  });
});
