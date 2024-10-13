import { assertEquals } from "jsr:@std/assert";
import { Timezone } from "../src/timezone.ts";
import { Zeit } from "../src/zeit.ts";

const userZone = Timezone.Europe.Berlin;
const zeit = Zeit.withUserZone(userZone);

Deno.test("Zeit - shortUser", () => {
  const userDateString = "2024-01-30T10:00:00";
  assertEquals(Zeit.user(userDateString, userZone).toISO(), `${userDateString}.000+01:00`, 'fromString');

  const userDate = new Date("2024-01-30T09:00:00Z");
  assertEquals(Zeit.user(userDate, userZone).toISO(), "2024-01-30T10:00:00.000+01:00", 'fromDate');
});

Deno.test("Zeit - shortDatabase", () => {
  const databaseDateString = "2021-05-07T00:00:00.000Z";
  assertEquals(Zeit.database(databaseDateString, userZone).toISO(), databaseDateString, 'toISO');
  assertEquals(Zeit.database(databaseDateString, userZone).toUserISO(), "2021-05-07T02:00:00.000+02:00", 'toUserISO');
});

Deno.test("Zeit - User to Database and back conversion", () => {
  const userDateString = "2024-01-30T10:00:00";
  const userZeit = zeit.fromUser(userDateString);
  const databaseZeit = userZeit.toDatabase();
  const backToUser = databaseZeit.toUser();

  assertEquals(userZeit.toISO(), "2024-01-30T10:00:00.000+01:00");
  assertEquals(databaseZeit.toISO(), "2024-01-30T09:00:00.000Z");
  assertEquals(backToUser.toISO(), "2024-01-30T10:00:00.000+01:00");
});

Deno.test("Zeit - DST handling", () => {
  const userZone = Timezone.America.New_York;
  const zeit = Zeit.withUserZone(userZone);

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
