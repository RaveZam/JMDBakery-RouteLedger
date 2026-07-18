const PH_OFFSET_MS = 8 * 60 * 60 * 1000;

/** Current time shifted to Philippines local time (UTC+8), regardless of server TZ. */
export function nowInManila(): Date {
  return new Date(Date.now() + PH_OFFSET_MS);
}

export function toDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Shifts by whole days in UTC. Forecast dates are compared and labelled via
 * their UTC fields (see nowInManila/toDateKey), so stepping with setDate --
 * which works in the *host* timezone -- could land a day either side. */
export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

export const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
