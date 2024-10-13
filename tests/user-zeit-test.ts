import { AssertionError, assertEquals, assertThrows } from "jsr:@std/assert";
import { UserZeit, Zeit } from '../mod.ts';
import { DateTime } from "../src/luxon-proxy.ts";
import { Timezone } from "../src/timezone.ts";

const userZone = Timezone.Europe.Berlin;

Deno.test("UserZeit - set different day", () => {
  const userZeit = Zeit.user("2024-01-30T10:34:12", userZone);
  const newUserZeit = userZeit.set({ day: 28 });
  assertEquals(newUserZeit.toISO(), "2024-01-28T10:34:12.000+01:00");
});

Deno.test("UserZeit - set time to midnight", () => {
  const userZeit = Zeit.user("2024-01-30T10:34:12", userZone);
  const newUserZeit = userZeit.set({ hour:0, minute:0, second:0, millisecond:0 });
  assertEquals(newUserZeit.toISO(), "2024-01-30T00:00:00.000+01:00");
});

Deno.test("UserZeit - Cycles with edge cases", () => {
  const userZone = Timezone.Europe.London;
  const zeit = Zeit.withUserZone(userZone);
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
  const zeit = Zeit.withUserZone(userZone);
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
  const zeit = Zeit.withUserZone(userZone);
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
  const zeit = Zeit.withUserZone(userZone);
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

Deno.test("UserZeit - CyclesFrom (valid start date)", () => {
  const userZone = Timezone.America.Chicago;
  const zeit = Zeit.withUserZone(userZone);
  const baseDate = zeit.fromUser("2024-03-15T09:00:00");

  const startDate = "2024-05-15T09:00:00";
  const cycles = baseDate.cyclesFrom(startDate, 3, { interval: "MONTHLY" });
  const periods = cycles.getPeriods();

  assertEquals(periods[0].startsAt.getZeit().toISO(), "2024-05-15T09:00:00.000-05:00");
  assertEquals(periods[0].endsAt.getZeit().toISO(), "2024-06-15T08:59:59.999-05:00");

  assertEquals(periods[1].startsAt.getZeit().toISO(), "2024-06-15T09:00:00.000-05:00");
  assertEquals(periods[1].endsAt.getZeit().toISO(), "2024-07-15T08:59:59.999-05:00");

  assertEquals(periods[2].startsAt.getZeit().toISO(), "2024-07-15T09:00:00.000-05:00");
  assertEquals(periods[2].endsAt.getZeit().toISO(), "2024-08-15T08:59:59.999-05:00");
});

Deno.test("UserZeit - CyclesFrom (invalid start date)", () => {
  const userZone = Timezone.America.Chicago;
  const zeit = Zeit.withUserZone(userZone);
  const baseDate = zeit.fromUser("2024-03-15T09:00:00");
  const startDate = "2024-05-01T09:00:00";

  assertThrows(() => {
    baseDate.cyclesFrom(startDate, 3, { interval: "MONTHLY" });
  }, AssertionError, "Invalid start date");
});

const subStartsAtString = '2024-03-01';

Deno.test("UserZeit - previousCycle", () => {
  const subStartsAt = Zeit.withUserZone(userZone);
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
  const subStartsAt = Zeit.withUserZone(userZone);
  const userZeit = subStartsAt.fromUser(subStartsAtString);
  const currentCycle = userZeit.currentCycle();

  const now = DateTime.now().setZone(userZone);
  const startOfMonth = now.startOf('month');
  const endOfMonth = now.endOf('month');

  assertEquals(currentCycle.startsAt.getZeit().toISO(), startOfMonth.toISO(), 'Start of current cycle');
  assertEquals(currentCycle.endsAt.getZeit().toISO(), endOfMonth.toISO(), 'End of current cycle');
  assertEquals(currentCycle.durationInDays, Math.round(endOfMonth.diff(startOfMonth, 'days').days), 'Days in current cycle');
});

Deno.test("UserZeit - nextCycle", () => {
  const subStartsAt = Zeit.withUserZone(userZone);
  const userZeit = subStartsAt.fromUser(subStartsAtString);
  const nextCycle = userZeit.nextCycle();

  const nextMonth = DateTime.now().setZone(userZone).plus({ months: 1 });
  const startOfNextMonth = nextMonth.startOf('month');
  const endOfNextMonth = nextMonth.endOf('month');

  assertEquals(nextCycle.startsAt.getZeit().toISO(), startOfNextMonth.toISO(), 'Start of next cycle');
  assertEquals(nextCycle.endsAt.getZeit().toISO(), endOfNextMonth.toISO(), 'End of next cycle');
  assertEquals(nextCycle.durationInDays, Math.round(endOfNextMonth.diff(startOfNextMonth, 'days').days), 'Days in next cycle');
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
  const zeit = Zeit.withUserZone(userZone);
  
  const leapYearStart = zeit.fromUser("2024-02-29T15:00:00");
  const leapYearCycles = leapYearStart.cycles(2, { interval: "YEARLY" });
  const leapYearPeriods = leapYearCycles.getPeriods();
  assertEquals(leapYearPeriods[0].startsAt.getZeit().toISO(), "2024-02-29T15:00:00.000+01:00", 'Start of first leap year cycle');
  assertEquals(leapYearPeriods[1].startsAt.getZeit().toISO(), "2025-02-28T15:00:00.000+01:00", 'Start of second leap year cycle');

  // TODO: Check that the duration is correct for both years
});
