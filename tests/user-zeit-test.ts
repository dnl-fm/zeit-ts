import { AssertionError, assertEquals, assertThrows } from "jsr:@std/assert";
import { UserZeit, Zeit } from '../mod.ts';
import { DateTime } from "../src/luxon-proxy.ts";
import { Timezone } from "../src/timezone.ts";

const userZone = Timezone.Europe.Berlin;
const userZoneZeit = Zeit.forTimezone(userZone);

Deno.test("UserZeit - DST handling", () => {
  const userZone = Timezone.America.New_York;
  const zeit = Zeit.forTimezone(userZone);

  // Before DST
  const beforeDST = zeit.fromUser("2024-03-10T01:00:00");
  assertEquals(beforeDST.toISO(), "2024-03-10T01:00:00.000-05:00");

  // During DST transition
  const duringDST = zeit.fromUser("2024-03-10T03:00:00");
  assertEquals(duringDST.toISO(), "2024-03-10T03:00:00.000-04:00");

  // After DST
  const afterDST = zeit.fromUser("2024-03-10T04:00:00");
  assertEquals(afterDST.toISO(), "2024-03-10T04:00:00.000-04:00");
});

Deno.test("UserZeit - set different day", () => {
  const userZeit = userZoneZeit.fromUser("2024-01-30T10:34:12");
  const newUserZeit = userZeit.set({ day: 28 });
  assertEquals(newUserZeit.toISO(), "2024-01-28T10:34:12.000+01:00");
});

Deno.test("UserZeit - set time to midnight", () => {
  const userZeit = userZoneZeit.fromUser("2024-01-30T10:34:12");
  const newUserZeit = userZeit.setToMidnight();
  assertEquals(newUserZeit.toISO(), "2024-01-30T00:00:00.000+01:00");
});

Deno.test("UserZeit - Cycles with edge cases", () => {
  const userZone = Timezone.Europe.London;
  const zeit = Zeit.forTimezone(userZone);
  const startDate = zeit.fromUser("2024-01-30T12:00:00");

  const cycles = startDate.cycles(3, { interval: "MONTHLY" });
  const periods = cycles.getPeriods();

  assertEquals(periods[0].startsAt.getZeit().toISO(), "2024-01-30T12:00:00.000+00:00");
  assertEquals(periods[0].endsAt.getZeit().toISO(), "2024-02-29T11:59:59.999+00:00");

  assertEquals(periods[1].startsAt.getZeit().toISO(), "2024-02-29T12:00:00.000+00:00");
  assertEquals(periods[1].endsAt.getZeit().toISO(), "2024-03-30T11:59:59.999+00:00");

  assertEquals(periods[2].startsAt.getZeit().toISO(), "2024-03-30T12:00:00.000+00:00");
  assertEquals(periods[2].endsAt.getZeit().toISO(), "2024-04-30T11:59:59.999+01:00");
});

Deno.test("UserZeit - Cycles across DST changes", () => {
  const userZone = Timezone.America.New_York;
  const zeit = Zeit.forTimezone(userZone);
  const startDate = zeit.fromUser("2024-02-15T12:00:00");

  const cycles = startDate.cycles(3, { interval: "MONTHLY" });
  const periods = cycles.getPeriods();

  assertEquals(periods[0].startsAt.getZeit().toISO(), "2024-02-15T12:00:00.000-05:00");
  assertEquals(periods[0].endsAt.getZeit().toISO(), "2024-03-15T11:59:59.999-04:00");

  assertEquals(periods[1].startsAt.getZeit().toISO(), "2024-03-15T12:00:00.000-04:00");
  assertEquals(periods[1].endsAt.getZeit().toISO(), "2024-04-15T11:59:59.999-04:00");

  assertEquals(periods[2].startsAt.getZeit().toISO(), "2024-04-15T12:00:00.000-04:00");
  assertEquals(periods[2].endsAt.getZeit().toISO(), "2024-05-15T11:59:59.999-04:00");
});

Deno.test("UserZeit - Cycles with year change", () => {
  const userZone = Timezone.Europe.Paris;
  const zeit = Zeit.forTimezone(userZone);
  const startDate = zeit.fromUser("2024-12-31T23:00:00");

  const cycles = startDate.cycles(2, { interval: "MONTHLY" });
  const periods = cycles.getPeriods();

  assertEquals(periods[0].startsAt.getZeit().toISO(), "2024-12-31T23:00:00.000+01:00");
  assertEquals(periods[0].endsAt.getZeit().toISO(), "2025-01-31T22:59:59.999+01:00");

  assertEquals(periods[1].startsAt.getZeit().toISO(), "2025-01-31T23:00:00.000+01:00");
  assertEquals(periods[1].endsAt.getZeit().toISO(), "2025-02-28T22:59:59.999+01:00");
});

Deno.test("UserZeit - Cycles with yearly interval", () => {
  const userZone = Timezone.Australia.Sydney;
  const zeit = Zeit.forTimezone(userZone);
  const startDate = zeit.fromUser("2024-02-29T15:00:00");

  const cycles = startDate.cycles(3, { interval: "YEARLY" });
  const periods = cycles.getPeriods();

  assertEquals(periods[0].startsAt.getZeit().toISO(), "2024-02-29T15:00:00.000+11:00");
  assertEquals(periods[0].endsAt.getZeit().toISO(), "2025-02-28T14:59:59.999+11:00");

  assertEquals(periods[1].startsAt.getZeit().toISO(), "2025-02-28T15:00:00.000+11:00");
  assertEquals(periods[1].endsAt.getZeit().toISO(), "2026-02-28T14:59:59.999+11:00");

  assertEquals(periods[2].startsAt.getZeit().toISO(), "2026-02-28T15:00:00.000+11:00");
  assertEquals(periods[2].endsAt.getZeit().toISO(), "2027-02-28T14:59:59.999+11:00");
});

Deno.test("UserZeit - CyclesFrom (start date with same day in month)", () => {
  const userZone = Timezone.America.Chicago;
  const zeit = Zeit.forTimezone(userZone);
  const baseDate = zeit.fromUser("2024-03-15T09:00:00");

  const startDate = zeit.fromUser("2024-05-15T09:00:00");
  const cycles = baseDate.cyclesFrom(startDate, 3, { interval: "MONTHLY" });
  const periods = cycles.getPeriods();

  assertEquals(periods[0].startsAt.getZeit().toISO(), "2024-05-15T09:00:00.000-05:00");
  assertEquals(periods[0].endsAt.getZeit().toISO(), "2024-06-15T08:59:59.999-05:00");

  assertEquals(periods[1].startsAt.getZeit().toISO(), "2024-06-15T09:00:00.000-05:00");
  assertEquals(periods[1].endsAt.getZeit().toISO(), "2024-07-15T08:59:59.999-05:00");

  assertEquals(periods[2].startsAt.getZeit().toISO(), "2024-07-15T09:00:00.000-05:00");
  assertEquals(periods[2].endsAt.getZeit().toISO(), "2024-08-15T08:59:59.999-05:00");
});

Deno.test("UserZeit - CyclesFrom (find nearest start date)", () => {
  const userZone = Timezone.Europe.Berlin;
  const zeit = Zeit.forTimezone(userZone);
  const baseDate = zeit.fromUser("2023-12-24T09:00:00");

  const startDate = zeit.fromUser("2023-12-19T09:00:00");
  const cycles = baseDate.cyclesFrom(startDate, 3, { interval: "MONTHLY" });
  const periods = cycles.getPeriods();

  assertEquals(periods[0].startsAt.getZeit().toISO(), "2023-12-24T09:00:00.000+01:00");
  assertEquals(periods[0].endsAt.getZeit().toISO(), "2024-01-24T08:59:59.999+01:00");

  assertEquals(periods[1].startsAt.getZeit().toISO(), "2024-01-24T09:00:00.000+01:00");
  assertEquals(periods[1].endsAt.getZeit().toISO(), "2024-02-24T08:59:59.999+01:00");

  assertEquals(periods[2].startsAt.getZeit().toISO(), "2024-02-24T09:00:00.000+01:00");
  assertEquals(periods[2].endsAt.getZeit().toISO(), "2024-03-24T08:59:59.999+01:00");
});

const subStartsAtString = '2024-03-01';

Deno.test("UserZeit - previousCycle", () => {
  const subStartsAt = Zeit.forTimezone(userZone);
  const userZeit = subStartsAt.fromUser(subStartsAtString);
  const previousCycle = userZeit.previousCycle();

  const previousMonth = DateTime.now().setZone(userZone).minus({ months: 1 });
  const startOfPreviousMonth = previousMonth.startOf('month');
  const endOfPreviousMonth = previousMonth.endOf('month');

  assertEquals(previousCycle.startsAt.getZeit().toISO(), startOfPreviousMonth.toISO(), 'Start of previous cycle');
  assertEquals(previousCycle.endsAt.getZeit().toISO(), endOfPreviousMonth.toISO(), 'End of previous cycle');
  assertEquals(previousCycle.durationInDays, Math.round(endOfPreviousMonth.diff(startOfPreviousMonth, 'days').days), 'Days in previous cycle');
});

Deno.test("UserZeit - currentCycle", () => {
  const subStartsAt = Zeit.forTimezone(userZone);
  const userZeit = subStartsAt.fromUser(subStartsAtString);
  const currentCycle = userZeit.currentCycle();

  const now = DateTime.now().setZone(userZone);
  const startOfMonth = now.startOf('month');
  const endOfMonth = now.endOf('month');

  assertEquals(currentCycle.startsAt.getZeit().toISO(), startOfMonth.toISO(), 'Start of current cycle');
  assertEquals(currentCycle.endsAt.getZeit().toISO(), endOfMonth.toISO(), 'End of current cycle');
  assertEquals(currentCycle.durationInDays, Math.round(endOfMonth.diff(startOfMonth, 'days').days), 'Days in current cycle');
});

Deno.test("UserZeit - currentCycle with now option", () => {
  const subStartsAt = Zeit.forTimezone(userZone);
  const userZeit = subStartsAt.fromUser(subStartsAtString);
  const now = userZoneZeit.fromUser('2024-05-10T12:00:00.000Z');
  const currentCycle = userZeit.currentCycle('MONTHLY', now);

  assertEquals(currentCycle.startsAt.toISO(), '2024-05-01T00:00:00.000+02:00', 'start monthly');
  assertEquals(currentCycle.endsAt.toISO(), '2024-05-31T23:59:59.999+02:00', 'end monthly');
  assertEquals(currentCycle.durationInDays, 31, 'Days monthly');
});

Deno.test("UserZeit - nextCycle", () => {
  const subStartsAt = Zeit.forTimezone(userZone);
  const userZeit = subStartsAt.fromUser(subStartsAtString);
  const nextCycle = userZeit.nextCycle();

  const nextMonth = DateTime.now().setZone(userZone).plus({ months: 1 });
  const startOfNextMonth = nextMonth.startOf('month');
  const endOfNextMonth = nextMonth.endOf('month');

  assertEquals(nextCycle.startsAt.getZeit().toISO(), startOfNextMonth.toISO(), 'Start of next cycle');
  assertEquals(nextCycle.endsAt.getZeit().toISO(), endOfNextMonth.toISO(), 'End of next cycle');
  assertEquals(nextCycle.durationInDays, Math.round(endOfNextMonth.diff(startOfNextMonth, 'days').days), 'Days in next cycle');
});

Deno.test('UserZeit - nextCycle with now option', () => {
  const userZeit = userZoneZeit.fromUser('2023-05-15T12:00:00.000Z');
  const startDateMonthly = userZoneZeit.fromUser('2023-07-10T12:00:00.000Z');

  // Test nextCycle with startsAt option
  const nextCycleWithStart = userZeit.nextCycle('MONTHLY', startDateMonthly);
  assertEquals(nextCycleWithStart.startsAt.toISODate(), '2023-07-15', 'start monthly');
  assertEquals(nextCycleWithStart.endsAt.toISODate(), '2023-08-15', 'end monthly');

  // Test with YEARLY interval
  const startDateYearly = userZoneZeit.fromUser('2023-06-15T12:00:00.000Z');
  const nextYearlyCycle = userZeit.nextCycle('YEARLY', startDateYearly);
  assertEquals(nextYearlyCycle.startsAt.toISODate(), '2024-05-15', 'start yearly');
  assertEquals(nextYearlyCycle.endsAt.toISODate(), '2025-05-15', 'end yearly');
});

Deno.test('UserZeit - previousCycle with now option', () => {
  const userZeit = userZoneZeit.fromUser('2023-05-15T12:00:00.000Z');
  const startDateMonthly = userZoneZeit.fromUser('2023-07-10T12:00:00.000Z');

  // Test nextCycle with startsAt option
  const nextCycleWithStart = userZeit.previousCycle('MONTHLY', startDateMonthly);
  assertEquals(nextCycleWithStart.startsAt.toISODate(), '2023-05-15', 'start monthly');
  assertEquals(nextCycleWithStart.endsAt.toISODate(), '2023-06-15', 'end monthly');

  // Test with YEARLY interval
  const startDateYearly = userZoneZeit.fromUser('2023-06-15T12:00:00.000Z');
  const nextYearlyCycle = userZeit.previousCycle('YEARLY', startDateYearly);
  assertEquals(nextYearlyCycle.startsAt.toISODate(), '2023-05-15', 'start yearly');
  assertEquals(nextYearlyCycle.endsAt.toISODate(), '2024-05-15', 'end yearly');
});

const startDate = DateTime.fromISO("2024-05-13T17:31:00", { zone: userZone });
const now = DateTime.fromISO("2024-10-15T00:00:00", {zone: userZone});

Deno.test("UserZeit - currentCycle (based on current date)", () => {
  const userZeit = new UserZeit(startDate, now);
  const currentCycle = userZeit.currentCycle();

  assertEquals(currentCycle.startsAt.getZeit().toISO(), "2024-10-13T17:31:00.000+02:00", 'Start of current cycle');
  assertEquals(currentCycle.endsAt.getZeit().toISO(), "2024-11-13T17:30:59.999+01:00", 'End of current cycle');
  assertEquals(currentCycle.durationInDays, 31, 'Days in current cycle');
});

Deno.test("UserZeit - nextCycle (based on current date)", () => {
  const userZeit = new UserZeit(startDate, now);
  const nextCycle = userZeit.nextCycle();

  assertEquals(nextCycle.startsAt.getZeit().toISO(), "2024-11-13T17:31:00.000+01:00", 'Start of next cycle');
  assertEquals(nextCycle.endsAt.getZeit().toISO(), "2024-12-13T17:30:59.999+01:00", 'End of next cycle');
  assertEquals(nextCycle.durationInDays, 30, 'Days in next cycle');
});

Deno.test("UserZeit - currentCycle; YEARLY interval (based on current date)", () => {
  const userZeit = new UserZeit(startDate, now);
  const currentCycle = userZeit.currentCycle('YEARLY');

  assertEquals(currentCycle.startsAt.getZeit().toISO(), "2024-05-13T17:31:00.000+02:00", 'Start of current cycle');
  assertEquals(currentCycle.endsAt.getZeit().toISO(), "2025-05-13T17:30:59.999+02:00", 'End of current cycle');
  assertEquals(currentCycle.durationInDays, 365, 'Days in current cycle');
});

Deno.test("UserZeit - nextCycle; YEARLY interval (based on current date)", () => {
  const userZeit = new UserZeit(startDate, now);
  const nextCycle = userZeit.nextCycle('YEARLY');

  assertEquals(nextCycle.startsAt.getZeit().toISO(), "2025-05-13T17:31:00.000+02:00", 'Start of next cycle');
  assertEquals(nextCycle.endsAt.getZeit().toISO(), "2026-05-13T17:30:59.999+02:00", 'End of next cycle');
  assertEquals(nextCycle.durationInDays, 365, 'Days in next cycle');
});

Deno.test("UserZeit - cycles with leap year", () => {
  const userZone = Timezone.Europe.Berlin;
  const zeit = Zeit.forTimezone(userZone);
  
  const leapYearStart = zeit.fromUser("2024-02-29T15:00:00");
  const leapYearCycles = leapYearStart.cycles(2, { interval: "YEARLY" });
  const leapYearPeriods = leapYearCycles.getPeriods();
  assertEquals(leapYearPeriods[0].startsAt.getZeit().toISO(), "2024-02-29T15:00:00.000+01:00", 'Start of first leap year cycle');
  assertEquals(leapYearPeriods[1].startsAt.getZeit().toISO(), "2025-02-28T15:00:00.000+01:00", 'Start of second leap year cycle');

  // TODO: Check that the duration is correct for both years
});

Deno.test("UserZeit - isSameDate", () => {
  const zeit1 = userZoneZeit.fromUser("2024-01-30T10:34:12");
  const zeit2 = userZoneZeit.fromUser("2024-01-30T15:00:00");
  const zeit3 = userZoneZeit.fromUser("2024-01-31T10:34:12");

  assertEquals(zeit1.isSameDate(zeit2), true, "Same date, different time");
  assertEquals(zeit1.isSameDate(zeit3), false, "Different date");
});

Deno.test("UserZeit - isAfter", () => {
  const zeit1 = userZoneZeit.fromUser("2024-01-30T10:34:12");
  const zeit2 = userZoneZeit.fromUser("2024-01-30T10:34:11");
  const zeit3 = userZoneZeit.fromUser("2024-01-30T10:34:13");

  assertEquals(zeit1.isAfter(zeit2), true, "Later time");
  assertEquals(zeit1.isAfter(zeit3), false, "Earlier time");
  assertEquals(zeit1.isAfter(zeit1), false, "Same time");
});

Deno.test("UserZeit - isSameOrAfter", () => {
  const zeit1 = userZoneZeit.fromUser("2024-01-30T10:34:12");
  const zeit2 = userZoneZeit.fromUser("2024-01-30T10:34:11");
  const zeit3 = userZoneZeit.fromUser("2024-01-30T10:34:13");

  assertEquals(zeit1.isSameOrAfter(zeit2), true, "Later time");
  assertEquals(zeit1.isSameOrAfter(zeit3), false, "Earlier time");
  assertEquals(zeit1.isSameOrAfter(zeit1), true, "Same time");
});

Deno.test("UserZeit - isBefore", () => {
  const zeit1 = userZoneZeit.fromUser("2024-01-30T10:34:12");
  const zeit2 = userZoneZeit.fromUser("2024-01-30T10:34:11");
  const zeit3 = userZoneZeit.fromUser("2024-01-30T10:34:13");

  assertEquals(zeit1.isBefore(zeit2), false, "Later time");
  assertEquals(zeit1.isBefore(zeit3), true, "Earlier time");
  assertEquals(zeit1.isBefore(zeit1), false, "Same time");
});

Deno.test("UserZeit - isSameOrBefore", () => {
  const zeit1 = userZoneZeit.fromUser("2024-01-30T10:34:12");
  const zeit2 = userZoneZeit.fromUser("2024-01-30T10:34:11");
  const zeit3 = userZoneZeit.fromUser("2024-01-30T10:34:13");

  assertEquals(zeit1.isSameOrBefore(zeit2), false, "Later time");
  assertEquals(zeit1.isSameOrBefore(zeit3), true, "Earlier time");
  assertEquals(zeit1.isSameOrBefore(zeit1), true, "Same time");
});

Deno.test("UserZeit.sortObjects - ascending order", () => {
  const objects = [
    {name: "A", createdAt: userZoneZeit.fromDatabase("2023-05-01T10:00:00Z").toUser()},
    {name: "B", createdAt: userZoneZeit.fromDatabase("2023-05-01T09:00:00Z").toUser()},
    {name: "C", createdAt: userZoneZeit.fromDatabase("2023-05-01T11:00:00Z").toUser()},
  ];

  const sortedAscending = UserZeit.sortObjects(objects, 'createdAt');

  assertEquals(sortedAscending.map(uz => uz.createdAt.toDatabaseISO()), [
    "2023-05-01T09:00:00.000Z",
    "2023-05-01T10:00:00.000Z",
    "2023-05-01T11:00:00.000Z",
  ]);
});

Deno.test("UserZeit.sortObjects - descending order", () => {
  const objects = [
    {name: "A", createdAt: userZoneZeit.fromDatabase("2023-05-01T10:00:00Z").toUser()},
    {name: "B", createdAt: userZoneZeit.fromDatabase("2023-05-01T09:00:00Z").toUser()},
    {name: "C", createdAt: userZoneZeit.fromDatabase("2023-05-01T11:00:00Z").toUser()},
  ];

  const sortedDescending = UserZeit.sortObjects(objects, 'createdAt', 'desc');

  assertEquals(sortedDescending.map(uz => uz.createdAt.toDatabaseISO()), [
    "2023-05-01T11:00:00.000Z",
    "2023-05-01T10:00:00.000Z",
    "2023-05-01T09:00:00.000Z",
  ]);
});

Deno.test("UserZeit.sortObjects - fail on invalid object", () => {
  const objects = [
    {name: "A", createdAt: "2023-05-01T10:00:00Z"},
    {name: "B", createdAt: userZoneZeit.fromUser("2023-05-01T09:00:00Z")},
  ];

  assertThrows(
    () => UserZeit.sortObjects(objects, 'createdAt', 'desc'),
    AssertionError,
    "Property \"createdAt\" is not a UserZeit instance"
  );
});

Deno.test("UserZeit.daysBetween - days between two UserZeit", () => {
  const dates = [
    {
      start: "2024-01-30T10:34:12",
      end: "2024-02-28T10:34:12",
      daysLeft: 29,
    },
    {
      start: "2024-05-14T10:34:12",
      end: "2024-05-16T10:34:12",
      daysLeft: 2,
    },
    {
      start: "2023-02-28T10:34:12",
      end: "2024-02-29T10:34:12",
      daysLeft: 366,
      description: "Non-leap year to leap year"
    },
    {
      start: "2024-02-29T10:34:12",
      end: "2025-02-28T10:34:12",
      daysLeft: 365,
      description: "Leap year to non-leap year"
    },
    {
      start: "2024-03-09T10:34:12",
      end: "2024-03-11T10:34:12",
      daysLeft: 2,
      description: "Across DST start (spring forward)"
    },
    {
      start: "2025-01-01T00:00:00",
      end: "2025-01-01T00:00:00",
      daysLeft: 0,
      description: "New Year transition"
    },
];

  dates.forEach((date) => {
    const startDate = userZoneZeit.fromUser(date.start);
    const endDate = userZoneZeit.fromUser(date.end);
    assertEquals(
      startDate.daysBetween(endDate),
      date.daysLeft,
      `${date.daysLeft} days left from ${date.start} to ${date.end}${date.description ? ` (${date.description})` : ''}`
    );
  });
});

Deno.test("UserZeit - format method", () => {
  const userZone = Timezone.Europe.Berlin;
  const zeit = Zeit.forTimezone(userZone);
  const userZeit = zeit.fromUser("2023-08-15T13:45:30.023");

  const formatTests = [
    { format: "S", expected: "23", description: "millisecond, no padding" },
    { format: "SSS", expected: "023", description: "millisecond, padded to 3" },
    { format: "u", expected: "023", description: "fractional seconds, functionally identical to SSS" },
    { format: "uu", expected: "02", description: "fractional seconds, between 0 and 99, padded to 2" },
    { format: "uuu", expected: "0", description: "fractional seconds, between 0 and 9" },
    { format: "s", expected: "30", description: "second, no padding" },
    { format: "ss", expected: "30", description: "second, padded to 2 padding" },
    { format: "m", expected: "45", description: "minute, no padding" },
    { format: "mm", expected: "45", description: "minute, padded to 2" },
    { format: "h", expected: "1", description: "hour in 12-hour time, no padding" },
    { format: "hh", expected: "01", description: "hour in 12-hour time, padded to 2" },
    { format: "H", expected: "13", description: "hour in 24-hour time, no padding" },
    { format: "HH", expected: "13", description: "hour in 24-hour time, padded to 2" },
    { format: "Z", expected: "+2", description: "narrow offset" },
    { format: "ZZ", expected: "+02:00", description: "short offset" },
    { format: "ZZZ", expected: "+0200", description: "techie offset" },
    { format: "ZZZZ", expected: "GMT+2", description: "abbreviated named offset" },
    { format: "ZZZZZ", expected: "Central European Summer Time", description: "unabbreviated named offset" },
    { format: "z", expected: "Europe/Berlin", description: "IANA zone" },
    { format: "a", expected: "PM", description: "meridiem" },
    { format: "d", expected: "15", description: "day of the month, no padding" },
    { format: "dd", expected: "15", description: "day of the month, padded to 2" },
    { format: "c", expected: "2", description: "day of the week, as number from 1-7 (Monday is 1, Sunday is 7)" },
    { format: "ccc", expected: "Tue", description: "day of the week, as an abbreviate localized string" },
    { format: "cccc", expected: "Tuesday", description: "day of the week, as an unabbreviated localized string" },
    { format: "ccccc", expected: "T", description: "day of the week, as a single localized letter" },
    { format: "L", expected: "8", description: "month as an unpadded number" },
    { format: "LL", expected: "08", description: "month as a padded number" },
    { format: "LLL", expected: "Aug", description: "month as an abbreviated localized string" },
    { format: "LLLL", expected: "August", description: "month as an unabbreviated localized string" },
    { format: "LLLLL", expected: "A", description: "month as a single localized letter" },
    { format: "y", expected: "2023", description: "year, unpadded" },
    { format: "yy", expected: "23", description: "two-digit year" },
    { format: "yyyy", expected: "2023", description: "four- to six- digit year, pads to 4" },
    { format: "G", expected: "AD", description: "abbreviated localized era" },
    { format: "GG", expected: "Anno Domini", description: "unabbreviated localized era" },
    { format: "GGGGG", expected: "A", description: "one-letter localized era" },
    { format: "kk", expected: "23", description: "ISO week year, unpadded" },
    { format: "kkkk", expected: "2023", description: "ISO week year, padded to 4" },
    { format: "W", expected: "33", description: "ISO week number, unpadded" },
    { format: "WW", expected: "33", description: "ISO week number, padded to 2" },
    { format: "o", expected: "227", description: "ordinal (day of year), unpadded" },
    { format: "ooo", expected: "227", description: "ordinal (day of year), padded to 3" },
    { format: "q", expected: "3", description: "quarter, no padding" },
    { format: "qq", expected: "03", description: "quarter, padded to 2" },
    { format: "D", expected: "8/15/2023", description: "localized numeric date" },
    { format: "DD", expected: "Aug 15, 2023", description: "localized date with abbreviated month" },
    { format: "DDD", expected: "August 15, 2023", description: "localized date with full month" },
    { format: "DDDD", expected: "Tuesday, August 15, 2023", description: "localized date with full month and weekday" },
    { format: "t", expected: "1:45 PM", description: "localized time" },
    { format: "tt", expected: "1:45:30 PM", description: "localized time with seconds" },
    { format: "ttt", expected: "1:45:30 PM GMT+2", description: "localized time with seconds and abbreviated offset" },
    { format: "tttt", expected: "1:45:30 PM Central European Summer Time", description: "localized time with seconds and full offset" },
    { format: "T", expected: "13:45", description: "localized 24-hour time" },
    { format: "TT", expected: "13:45:30", description: "localized 24-hour time with seconds" },
    { format: "TTT", expected: "13:45:30 GMT+2", description: "localized 24-hour time with seconds and abbreviated offset" },
    { format: "TTTT", expected: "13:45:30 Central European Summer Time", description: "localized 24-hour time with seconds and full offset" },
    { format: "f", expected: "8/15/2023, 1:45 PM", description: "short localized date and time" },
    { format: "ff", expected: "Aug 15, 2023, 1:45 PM", description: "less short localized date and time" },
    { format: "fff", expected: "August 15, 2023 at 1:45 PM GMT+2", description: "verbose localized date and time" },
    { format: "ffff", expected: "Tuesday, August 15, 2023 at 1:45 PM Central European Summer Time", description: "extra verbose localized date and time" },
    { format: "F", expected: "8/15/2023, 1:45:30 PM", description: "short localized date and time with seconds" },
    { format: "FF", expected: "Aug 15, 2023, 1:45:30 PM", description: "less short localized date and time with seconds" },
    { format: "FFF", expected: "August 15, 2023 at 1:45:30 PM GMT+2", description: "verbose localized date and time with seconds" },
    { format: "FFFF", expected: "Tuesday, August 15, 2023 at 1:45:30 PM Central European Summer Time", description: "extra verbose localized date and time with seconds" },
    { format: "X", expected: "1692099930", description: "unix timestamp in seconds" },
    { format: "x", expected: "1692099930023", description: "unix timestamp in milliseconds" },
  ];

  formatTests.forEach(({ format, expected, description }) => {
    const result = userZeit.format(format).replace(/\s+/g, '');
    expected = expected.replace(/\s+/g, '');
    assertEquals(result, expected, `'${format}' (${description}) --> expected: '${expected}' (chars: ${expected.length}); received: '${result}' (chars: ${result.length})`);
  });
});
