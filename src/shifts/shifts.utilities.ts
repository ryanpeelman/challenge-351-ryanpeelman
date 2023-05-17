import { Dictionary, groupBy } from "lodash";
import { ShiftModel } from "../data/models";

export function groupByDate(shifts: ShiftModel[]): Dictionary<ShiftModel[]> {
  const groupedShifts = groupBy<ShiftModel>(shifts, (s) =>
    s.start.toDateString()
  );
  return groupedShifts;
}

export function isWithinDateRange(
  check: Date,
  start: Date,
  end: Date
): boolean {
  const startTime = start.getTime();
  const endTime = end.getTime();

  const checkTime = check.getTime();

  return startTime <= checkTime && checkTime <= endTime;
}
