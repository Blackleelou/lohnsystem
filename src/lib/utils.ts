// src/lib/utils.ts

// Dummy-Funktion, kann angepasst werden
export function normalizeShifts(shifts: { startTime: string; endTime: string }[]) {
  return shifts.map(s => ({
    startTime: s.startTime,
    endTime: s.endTime,
  }));
}
