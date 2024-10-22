import { assert } from 'assert/assert';
import type { DateObjectUnits, DurationLike } from 'npm:@types/luxon@3';
import { DateTime } from './luxon-proxy.ts';
import { Timezone } from './timezone.ts';
import { UserZeit } from './user-zeit.ts';

/**
 * Represents a Zeit (time) object in the database timezone (UTC).
 */
export class DatabaseZeit {
  /**
   * Creates a new DatabaseZeit instance.
   * @param dateTime The Luxon DateTime object representing the time in UTC.
   * @param userTimezone The user's timezone, used when converting back to UserZeit.
   */
  constructor(private dateTime: DateTime, private userTimezone: Timezone) {}

  /**
   * Gets the value of the specified unit from the DateTime object.
   * @param unit - The unit to get from the DateTime object (e.g., 'year', 'month', 'day', 'hour', etc.).
   * @returns The numeric value of the specified unit.
   */
  get(unit: keyof DateTime): number {
    return this.getZeit().get(unit);
  }

  /**
   * Sets specified components of the date/time.
   * @param values An object containing the components to set and their values.
   * @returns This DatabaseZeit instance for method chaining.
   */
  set(values: DateObjectUnits): DatabaseZeit {
    this.dateTime = this.getZeit().set(values);
    return this;
  }

  /**
   * Gets the Luxon DateTime object for this DatabaseZeit.
   * @returns The Luxon DateTime object in UTC.
   */
  getZeit(): DateTime {
    return this.dateTime;
  }

  /**
   * Gets the timezone of this DatabaseZeit (always UTC).
   * @returns The UTC timezone.
   */
  getTimezone(): Timezone {
    return Timezone.UTC;
  }

  /**
   * Converts the DatabaseZeit to an ISO 8601 string.
   * @returns The ISO 8601 string representation of the DatabaseZeit.
   */
  toISO(): string {
    return this.dateTime.toISO()!;
  }

  /**
   * Converts the DatabaseZeit to an ISO 8601 date string (without time).
   * @returns The ISO 8601 date string representation of the DatabaseZeit.
   */
  toISODate(): string {
    return this.dateTime.toISODate()!;
  }

  /**
   * Subtracts a duration from the current time.
   * @param duration - The duration to subtract.
   * @returns This DatabaseZeit instance for method chaining.
   */
  minus(duration: DurationLike): DatabaseZeit {
    this.dateTime = this.getZeit().minus(duration);
    return this;
  }

  /**
   * Adds a duration to the current time.
   * @param duration - The duration to add.
   * @returns This DatabaseZeit instance for method chaining.
   */
  plus(duration: DurationLike): DatabaseZeit {
    this.dateTime = this.getZeit().plus(duration);
    return this;
  }

  /**
   * Converts this DatabaseZeit to a UserZeit in the user's timezone.
   * @returns A new UserZeit instance.
   * @throws {Error} If the resulting date is invalid.
   */
  toUser(): UserZeit {
    const userZeit = this.dateTime.setZone(this.userTimezone);
    assert(userZeit.isValid, `Invalid date: ${userZeit.toISO()}`);

    return new UserZeit(userZeit);
  }

  /**
   * Converts this DatabaseZeit to a UserZeit ISO 8601 string in the user's timezone.
   * @returns The ISO 8601 string representation of the UserZeit.
   */
  toUserISO(): string {
    return this.toUser().toISO();
  }

  /**
   * Converts this DatabaseZeit to a UserZeit ISO 8601 date string (without time) in the user's timezone.
   * @returns The ISO 8601 date string representation of the UserZeit.
   */
  toUserISODate(): string {
    return this.toUser().toISODate();
  }
}
