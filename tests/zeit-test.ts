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
