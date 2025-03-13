import { assertEquals, assertThrows } from "jsr:@std/assert";
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

Deno.test("Zeit - removeTimezoneInformation", () => {
  assertEquals(
    Zeit.removeTimezoneInformation("2024-03-15T10:00:00.000Z"),
    "2024-03-15T10:00:00.000",
    "Should remove Z timezone"
  );
  assertEquals(
    Zeit.removeTimezoneInformation("2024-03-15T10:00:00.000+02:00"),
    "2024-03-15T10:00:00.000",
    "Should remove +02:00 timezone"
  );
  assertEquals(
    Zeit.removeTimezoneInformation("2024-03-15T10:00:00.000-0500"),
    "2024-03-15T10:00:00.000",
    "Should remove -0500 timezone"
  );
  assertEquals(
    Zeit.removeTimezoneInformation("2024-03-15T10:00:00.000"),
    "2024-03-15T10:00:00.000",
    "Should not modify string without timezone"
  );
});

Deno.test("Zeit - invalid date handling", () => {
  const zeit = Zeit.forTimezone(Timezone.UTC);
  
  assertThrows(
    () => zeit.fromUser("invalid-date"),
    Error,
    "Invalid date",
    "Should throw error for invalid date string"
  );

  assertThrows(
    () => zeit.fromUser("2024-13-45T25:00:00"),
    Error,
    "Invalid date",
    "Should throw error for invalid month/day/hour"
  );

  const invalidDate = new Date("invalid");
  assertThrows(
    () => zeit.fromUser(invalidDate),
    Error,
    "Invalid date",
    "Should throw error for invalid Date object"
  );
});
