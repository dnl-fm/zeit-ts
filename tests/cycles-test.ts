import { AssertionError } from 'assert';
import { assertEquals, assertNotEquals, assertThrows } from "jsr:@std/assert";
import { Cycles } from "../src/cycles.ts";
import { Timezone } from "../src/timezone.ts";
import { Zeit } from "../src/zeit.ts";

const userZone = Timezone.Europe.Berlin;
const zeit = Zeit.withUserZone(userZone);

function createTestCycles() {
  const periods = [
    { startsAt: zeit.fromUser("2024-01-01T00:00:00"), endsAt: zeit.fromUser("2024-01-31T23:59:59"), in_days: 31 },
    { startsAt: zeit.fromUser("2024-02-01T00:00:00"), endsAt: zeit.fromUser("2024-02-29T23:59:59"), in_days: 29 },
    { startsAt: zeit.fromUser("2024-03-01T00:00:00"), endsAt: zeit.fromUser("2024-03-31T23:59:59"), in_days: 31 },
  ];
  return Cycles.fromPeriods(periods);
}

Deno.test("Cycles - fromPeriods and getPeriods", () => {
  const cycles = createTestCycles();
  assertEquals(cycles.getPeriods().length, 3);
});

Deno.test("Cycles - getNumberOfPeriods", () => {
  const cycles = createTestCycles();
  assertEquals(cycles.getNumberOfPeriods(), 3);
});

Deno.test("Cycles - getFirstPeriod", () => {
  const cycles = createTestCycles();
  const firstPeriod = cycles.getFirstPeriod();
  assertEquals(firstPeriod.startsAt.getZeit().toISO(), "2024-01-01T00:00:00.000+01:00");
  assertEquals(firstPeriod.in_days, 31);
});

Deno.test("Cycles - getLastPeriod", () => {
  const cycles = createTestCycles();
  const lastPeriod = cycles.getLastPeriod();
  assertEquals(lastPeriod.endsAt.getZeit().toISO(), "2024-03-31T23:59:59.000+02:00");
  assertEquals(lastPeriod.in_days, 31);
});

Deno.test("Cycles - findPeriod", () => {
  const cycles = createTestCycles();
  const date = zeit.fromUser("2024-02-15T12:00:00");
  const period = cycles.findPeriod(date.getZeit().toISO() as string);
  assertEquals(period?.startsAt.getZeit().toISO() as string, "2024-02-01T00:00:00.000+01:00");
  assertEquals(period?.endsAt.getZeit().toISO() as string, "2024-02-29T23:59:59.000+01:00");
  assertEquals(period?.in_days, 29);
});

Deno.test("Cycles - findBefore", () => {
  const cycles = createTestCycles();
  const date = zeit.fromUser("2024-02-15T12:00:00");
  const period = cycles.findBefore(date.getZeit().toISO() as string);
  assertEquals(period?.startsAt.getZeit().toISO() as string, "2024-01-01T00:00:00.000+01:00");
  assertEquals(period?.endsAt.getZeit().toISO() as string, "2024-01-31T23:59:59.000+01:00");
  assertEquals(period?.in_days, 31);
});

Deno.test("Cycles - findAfter", () => {
  const cycles = createTestCycles();
  const date = zeit.fromUser("2024-02-15T12:00:00");
  const period = cycles.findAfter(date.getZeit().toISO() as string);
  assertNotEquals(period, undefined);
  assertEquals(period?.startsAt.getZeit().toISO() as string, "2024-03-01T00:00:00.000+01:00");
  assertEquals(period?.endsAt.getZeit().toISO() as string, "2024-03-31T23:59:59.000+02:00");
  assertEquals(period?.in_days, 31);
});

Deno.test("Cycles - findPeriod (edge cases)", () => {
  const cycles = createTestCycles();
  const startDate = zeit.fromUser("2024-01-01T00:00:00");
  const endDate = zeit.fromUser("2024-03-31T23:59:59");
  const middleDate = zeit.fromUser("2024-02-15T12:00:00");

  const startPeriod = cycles.findPeriod(startDate.getZeit().toISO() as string);
  const endPeriod = cycles.findPeriod(endDate.getZeit().toISO() as string);
  const middlePeriod = cycles.findPeriod(middleDate.getZeit().toISO() as string);

  assertNotEquals(startPeriod, undefined);
  assertNotEquals(endPeriod, undefined);
  assertNotEquals(middlePeriod, undefined);

  assertEquals(startPeriod?.startsAt.getZeit().toISO() as string, "2024-01-01T00:00:00.000+01:00");
  assertEquals(startPeriod?.in_days, 31);
  assertEquals(endPeriod?.endsAt.getZeit().toISO() as string, "2024-03-31T23:59:59.000+02:00");
  assertEquals(endPeriod?.in_days, 31);
  assertEquals(middlePeriod?.startsAt.getZeit().toISO() as string, "2024-02-01T00:00:00.000+01:00");
  assertEquals(middlePeriod?.in_days, 29);
});

Deno.test("Cycles - findPeriod throws for date before all periods", () => {
  const cycles = createTestCycles();
  const date = zeit.fromUser("2023-12-31T23:59:59");
  assertThrows(
    () => {
      cycles.findPeriod(date.getZeit().toISO() as string);
    },
    AssertionError,
    "Period not found"
  );
});

Deno.test("Cycles - findPeriod throws for date after all periods", () => {
  const cycles = createTestCycles();
  const date = zeit.fromUser("2024-04-01T00:00:00");
  assertThrows(
    () => {
      cycles.findPeriod(date.getZeit().toISO() as string);
    },
    AssertionError,
    "Period not found"
  );
});

Deno.test("Cycles - findBefore throws for date before all periods", () => {
  const cycles = createTestCycles();
  const date = zeit.fromUser("2023-12-31T23:59:59");
  assertThrows(
    () => {
      cycles.findBefore(date.getZeit().toISO() as string);
    },
    AssertionError,
    "Period not found"
  );
});

Deno.test("Cycles - findAfter throws for date after all periods", () => {
  const cycles = createTestCycles();
  const date = zeit.fromUser("2024-04-01T00:00:00");
  assertThrows(
    () => {
      cycles.findAfter(date.getZeit().toISO() as string);
    },
    AssertionError,
    "Period not found"
  );
});
