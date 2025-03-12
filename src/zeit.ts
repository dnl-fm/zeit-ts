import { assertEquals } from 'assert/equals';
import { z } from 'zod';
import { DatabaseZeit } from './database-zeit.ts';
import { DateTime } from './luxon-proxy.ts';
import { Timezone, type TimezoneSchema } from './timezone.ts';
import { UserZeit } from './user-zeit.ts';

const dateTimeStringSchema: z.ZodType<string> = z.string().datetime();
export type ZeitSchema = z.infer<typeof dateTimeStringSchema>;
export type ZeitPeriod = { startsAt: UserZeit; endsAt: UserZeit; durationInDays: number };
export type ZeitInterval = 'MONTHLY' | 'YEARLY';

/**
 * Represents a Zeit (time) object with timezone awareness.
 * This class serves as a factory for creating UserZeit and DatabaseZeit instances.
 */
export class Zeit {
  /**
   * Removes the timezone information from a Zeit string.
   * @param zeit The Zeit string to remove the timezone information from.
   * @returns The Zeit string without the timezone information.
   */
  static removeTimezoneInformation(zeit: ZeitSchema): ZeitSchema {
    // 2023-05-29T10:00:00.000Z --> 2023-05-29T10:00:00.000
    // 2023-05-29T10:00:00.000+02:00 --> 2023-05-29T10:00:00.000
    return zeit.replace(/([+-]\d{2}:*\d{2}|Z)$/, '');
  }

  /**
   * Creates a new Zeit instance with the specified user timezone.
   * @param zone The user's timezone.
   * @returns A new Zeit instance.
   */
  static forTimezone(zone: z.infer<typeof TimezoneSchema>): Zeit {
    return new Zeit(zone);
  }

  /**
   * Creates a new Zeit instance.
   * @param timezone The timezone for this Zeit instance.
   */
  constructor(private timezone: z.infer<typeof TimezoneSchema>) {}

  /**
   * Creates a UserZeit instance representing the current time in the specified timezone.
   * @param timezone - The timezone to use.
   * @param now - Optional DateTime object representing the current time.
   * @returns A new UserZeit instance.
   */
  fromNow(now?: DateTime): UserZeit {
    return UserZeit.fromNow(this.timezone, now);
  }

  /**
   * Creates a UserZeit instance from a user time string.
   * @param zeit The user's time as a string in ISO 8601 format.
   * @returns A new UserZeit instance.
   */
  fromUser(zeit: ZeitSchema | Date): UserZeit {
    /**
     * Timezone will be set by the assigned timezone (Zeit.fromTimezone())
     * - therefore we need to remove the timezone information if present
     * - if the timezone information is present, we will build the wrong time
     */
    if (typeof zeit === 'string') zeit = Zeit.removeTimezoneInformation(zeit);

    if (zeit instanceof Date) zeit = this.fromDate(zeit).toISO()!;

    return new UserZeit(this.getLuxonDateTime(zeit, this.timezone));
  }

  /**
   * Creates a DatabaseZeit instance from a database time string.
   * @param zeit The database time as a string in ISO 8601 format.
   * @returns A new DatabaseZeit instance.
   */
  fromDatabase(zeit: ZeitSchema | Date): DatabaseZeit {
    if (zeit instanceof Date) {
      zeit = this.fromDate(zeit).toISO()!;
    }
    return new DatabaseZeit(this.getLuxonDateTime(zeit, Timezone.UTC), this.timezone);
  }

  /**
   * Gets the timezone of this Zeit instance.
   * @returns The timezone.
   */
  getTimezone(): z.infer<typeof TimezoneSchema> {
    return this.timezone;
  }

  /**
   * Converts a JavaScript Date object to a Luxon DateTime object.
   * @param date The JavaScript Date object to convert.
   * @returns A Luxon DateTime object in the Zeit instance's timezone.
   * @private
   */
  private fromDate(date: Date): DateTime {
    const dateTime = DateTime.fromJSDate(date, { zone: this.timezone });
    assertEquals(dateTime.isValid, true, 'Invalid date');
    return dateTime;
  }

  /**
   * Creates a Luxon DateTime object from a date string and timezone.
   * @param date The date string in ISO 8601 format.
   * @param timezone The timezone.
   * @returns A Luxon DateTime object.
   * @private
   */
  private getLuxonDateTime(date: ZeitSchema, timezone: z.infer<typeof TimezoneSchema>): DateTime {
    return DateTime.fromISO(date, { zone: timezone });
  }
}
