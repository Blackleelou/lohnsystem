import { format } from "date-fns";

function roundToQuarterHour(date: Date) {
  const rounded = new Date(date);
  const minutes = date.getMinutes();
  const roundMinutes = Math.round(minutes / 15) * 15;
  rounded.setMinutes(roundMinutes % 60);
  rounded.setHours(rounded.getHours() + Math.floor(roundMinutes / 60));
  rounded.setSeconds(0);
  rounded.setMilliseconds(0);
  return rounded;
}

export function normalizeShifts(shifts: { startTime: string, endTime: string }[]) {
  const map = new Map<string, number>();

  for (const shift of shifts) {
    const start = roundToQuarterHour(new Date(shift.startTime));
    const end = roundToQuarterHour(new Date(shift.endTime));
    const label = `${format(start, "HH:mm")}–${format(end, "HH:mm")} Uhr`;

    map.set(label, (map.get(label) || 0) + 1);
  }

  const result = Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);

  return result;
}
