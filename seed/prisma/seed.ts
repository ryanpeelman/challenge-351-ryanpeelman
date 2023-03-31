import { PrismaClient, Profession } from '@prisma/client';
import { randomBytes } from 'node:crypto';
const prisma = new PrismaClient();

const maxFacilities = 10;
const maxDocuments = 10;
const maxDocumentWorkers = 500;
const maxWorkers = 100;
const maxShifts = 20 * 1000 * 100; // 2M
const startHours = [5, 13, 20];
const shiftHours = 5;

function returnRandomNumberBetweenOneAndLimit(limit: number): number {
  return Math.floor(Math.random() * limit) + 1;
}

function returnRandomBoolean(): boolean {
  const number = returnRandomNumberBetweenOneAndLimit(10);
  return number <= 5 ? true : false;
}

function returnRandomString(length: number): string {
  return randomBytes(length).toString('hex');
}

function returnRandomProfession(): Profession {
  const index = returnRandomNumberBetweenOneAndLimit(3) - 1;
  return [Profession.CNA, Profession.LVN, Profession.RN][index];
}

function returnRandomWorkerIdForshift(): number | null {
  const returnWorkerId = returnRandomBoolean();
  return returnWorkerId
    ? returnRandomNumberBetweenOneAndLimit(maxWorkers)
    : null;
}

interface StartEnd {
  start: Date;
  end: Date;
}

function returnRandomStartAndEnd(): StartEnd {
  const day = returnRandomNumberBetweenOneAndLimit(31);
  const startHourIndex = returnRandomNumberBetweenOneAndLimit(3) - 1;
  const startHour = startHours[startHourIndex];
  const start = new Date();
  start.setFullYear(2023, 1, day);
  start.setHours(startHour, 0, 0);
  const end = new Date(start.getTime());
  end.setTime(end.getTime() + shiftHours * 60 * 60 * 1000);
  return {
    start,
    end,
  };
}

async function insertDocuments() {
  console.log('Starting to seed documents ...');
  const documents = [];
  for (let i = 0; i < maxDocuments; i++) {
    documents.push({
      name: returnRandomString(20),
      is_active: returnRandomBoolean(),
    });
  }
  await prisma.document.createMany({ data: documents });
  console.log('Finished seeding documents ...');
}

async function insertFacilities() {
  console.log('Starting to seed facilities ...');

  const facilities = [];
  for (let i = 0; i < maxFacilities; i++) {
    facilities.push({
      name: returnRandomString(20),
      is_active: returnRandomBoolean(),
    });
  }
  await prisma.facility.createMany({ data: facilities });
  console.log('Finished seeding facilities ...');
}

async function insertWorkers() {
  console.log('Starting to seed workers ...');
  const workers = [];
  for (let i = 0; i < maxWorkers; i++) {
    workers.push({
      name: returnRandomString(20),
      is_active: returnRandomBoolean(),
      profession: returnRandomProfession(),
    });
  }
  await prisma.worker.createMany({ data: workers });
  console.log('Finished seeding workers ...');
}

async function insertFacilityRequirements() {
  console.log('Starting to seed facility requirements ...');
  const maxFacilityRequirements = 2000;
  const facilityRequirements = [];
  for (let i = 0; i < maxFacilityRequirements; i++) {
    facilityRequirements.push({
      facility_id: returnRandomNumberBetweenOneAndLimit(maxFacilities),
      document_id: returnRandomNumberBetweenOneAndLimit(maxDocuments),
    });
  }
  await prisma.facilityRequirement.createMany({ data: facilityRequirements });
  console.log('Finished seeding facility requirements ...');
}

async function insertDocumentWorkers() {
  console.log('Starting to seed document workers ...');
  const documentWorkers = [];
  for (let i = 0; i < maxDocumentWorkers; i++) {
    documentWorkers.push({
      worker_id: returnRandomNumberBetweenOneAndLimit(maxWorkers),
      document_id: returnRandomNumberBetweenOneAndLimit(maxDocuments),
    });
  }
  await prisma.documentWorker.createMany({ data: documentWorkers });
  console.log('Finished seeding document workers ...');
}

async function insertShifts() {
  console.log('Starting to seed shifts ...');
  const maxShiftsPerArray = 10000;
  const maxRounds = maxShifts / maxShiftsPerArray;
  for (let i = 0; i < maxRounds; i++) {
    const shifts = [];
    console.log(`Starting shift seed round #${i + 1}`);
    for (let j = 0; j < maxShiftsPerArray; j++) {
      const { start, end } = returnRandomStartAndEnd();
      shifts.push({
        start,
        end,
        profession: returnRandomProfession(),
        is_deleted: returnRandomBoolean(),
        facility_id: returnRandomNumberBetweenOneAndLimit(maxFacilities),
        worker_id: returnRandomWorkerIdForshift(),
      });
    }
    await prisma.shift.createMany({ data: shifts });
  }

  console.log('Finished seeding shifts ...');
}

async function main() {
  console.log(`Start seeding ...`);
  await insertDocuments();
  await insertFacilities();
  await insertWorkers();
  await insertFacilityRequirements();
  await insertDocumentWorkers();
  await insertShifts();
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
