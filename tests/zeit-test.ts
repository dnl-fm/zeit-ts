import { assertEquals } from "jsr:@std/assert";
import { Timezone } from "../src/timezone.ts";
import { Zeit } from "../src/zeit.ts";

Deno.test("Zeit - User to Database and back conversion", () => {
  const userDateString = "2024-01-30T10:00:00";
  const userZone = Timezone.Europe.Berlin;
  const zeit = Zeit.withUserZone(userZone);
  const userZeit = zeit.fromUser(userDateString);
  const databaseZeit = userZeit.toDatabase();
  const backToUser = databaseZeit.toUser();

  assertEquals(userZeit.getZeit().toISO(), "2024-01-30T10:00:00.000+01:00");
  assertEquals(databaseZeit.getZeit().toISO(), "2024-01-30T09:00:00.000Z");
  assertEquals(backToUser.getZeit().toISO(), "2024-01-30T10:00:00.000+01:00");
});

Deno.test("Zeit - DST handling", () => {
  const userZone = Timezone.America.New_York;
  const zeit = Zeit.withUserZone(userZone);

  // Before DST
  const beforeDST = zeit.fromUser("2024-03-10T01:00:00");
  assertEquals(beforeDST.getZeit().toISO(), "2024-03-10T01:00:00.000-05:00");

  // During DST transition
  const duringDST = zeit.fromUser("2024-03-10T03:00:00");
  assertEquals(duringDST.getZeit().toISO(), "2024-03-10T03:00:00.000-04:00");

  // After DST
  const afterDST = zeit.fromUser("2024-03-10T04:00:00");
  assertEquals(afterDST.getZeit().toISO(), "2024-03-10T04:00:00.000-04:00");
});

Deno.test("Zeit - Cycles with edge cases", () => {
  const userZone = Timezone.Europe.London;
  const zeit = Zeit.withUserZone(userZone);
  const startDate = zeit.fromUser("2024-01-30T12:00:00");

  const cycles = startDate.cycles(3, { interval: "MONTHLY" });
  const periods = cycles.getPeriods();

  assertEquals(periods[0].startsAt.getZeit().toISO(), "2024-01-30T12:00:00.000+00:00");
  assertEquals(periods[0].endsAt.getZeit().toISO(), "2024-02-29T11:59:59.000+00:00");

  assertEquals(periods[1].startsAt.getZeit().toISO(), "2024-02-29T12:00:00.000+00:00");
  assertEquals(periods[1].endsAt.getZeit().toISO(), "2024-03-30T11:59:59.000+00:00");

  assertEquals(periods[2].startsAt.getZeit().toISO(), "2024-03-30T12:00:00.000+00:00");
  assertEquals(periods[2].endsAt.getZeit().toISO(), "2024-04-30T11:59:59.000+01:00");
});

Deno.test("Zeit - Cycles across DST changes", () => {
  const userZone = Timezone.America.New_York;
  const zeit = Zeit.withUserZone(userZone);
  const startDate = zeit.fromUser("2024-02-15T12:00:00");

  const cycles = startDate.cycles(3, { interval: "MONTHLY" });
  const periods = cycles.getPeriods();

  assertEquals(periods[0].startsAt.getZeit().toISO(), "2024-02-15T12:00:00.000-05:00");
  assertEquals(periods[0].endsAt.getZeit().toISO(), "2024-03-15T11:59:59.000-04:00");

  assertEquals(periods[1].startsAt.getZeit().toISO(), "2024-03-15T12:00:00.000-04:00");
  assertEquals(periods[1].endsAt.getZeit().toISO(), "2024-04-15T11:59:59.000-04:00");

  assertEquals(periods[2].startsAt.getZeit().toISO(), "2024-04-15T12:00:00.000-04:00");
  assertEquals(periods[2].endsAt.getZeit().toISO(), "2024-05-15T11:59:59.000-04:00");
});

Deno.test("Zeit - Cycles with year change", () => {
  const userZone = Timezone.Europe.Paris;
  const zeit = Zeit.withUserZone(userZone);
  const startDate = zeit.fromUser("2024-12-31T23:00:00");

  const cycles = startDate.cycles(2, { interval: "MONTHLY" });
  const periods = cycles.getPeriods();

  assertEquals(periods[0].startsAt.getZeit().toISO(), "2024-12-31T23:00:00.000+01:00");
  assertEquals(periods[0].endsAt.getZeit().toISO(), "2025-01-31T22:59:59.000+01:00");

  assertEquals(periods[1].startsAt.getZeit().toISO(), "2025-01-31T23:00:00.000+01:00");
  assertEquals(periods[1].endsAt.getZeit().toISO(), "2025-02-28T22:59:59.000+01:00");
});

Deno.test("Zeit - Cycles with yearly interval", () => {
  const userZone = Timezone.Australia.Sydney;
  const zeit = Zeit.withUserZone(userZone);
  const startDate = zeit.fromUser("2024-02-29T15:00:00");

  const cycles = startDate.cycles(3, { interval: "YEARLY" });
  const periods = cycles.getPeriods();

  assertEquals(periods[0].startsAt.getZeit().toISO(), "2024-02-29T15:00:00.000+11:00");
  assertEquals(periods[0].endsAt.getZeit().toISO(), "2025-02-28T14:59:59.000+11:00");

  assertEquals(periods[1].startsAt.getZeit().toISO(), "2025-02-28T15:00:00.000+11:00");
  assertEquals(periods[1].endsAt.getZeit().toISO(), "2026-02-28T14:59:59.000+11:00");

  assertEquals(periods[2].startsAt.getZeit().toISO(), "2026-02-28T15:00:00.000+11:00");
  assertEquals(periods[2].endsAt.getZeit().toISO(), "2027-02-28T14:59:59.000+11:00");
});
