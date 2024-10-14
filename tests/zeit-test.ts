import { assertEquals } from "jsr:@std/assert";
import { Timezone } from "../src/timezone.ts";
import { Zeit } from "../src/zeit.ts";

const userZone = Timezone.Europe.Berlin;
const zeit = Zeit.forTimezone(userZone);

Deno.test("Zeit - User to Database and back conversion", () => {
  const userDateString = "2024-01-30T10:00:00";
  const userZeit = zeit.fromUser(userDateString);
  const databaseZeit = userZeit.toDatabase();
  const backToUser = databaseZeit.toUser();

  assertEquals(userZeit.toISO(), "2024-01-30T10:00:00.000+01:00");
  assertEquals(databaseZeit.toISO(), "2024-01-30T09:00:00.000Z");
  assertEquals(backToUser.toISO(), "2024-01-30T10:00:00.000+01:00");
});
