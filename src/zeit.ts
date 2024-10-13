import { z } from 'zod';
import { DatabaseZeit } from './database-zeit.ts';
import { DateTime } from './luxon-proxy.ts';
import { Timezone, type TimezoneSchema } from './timezone.ts';
import { UserZeit } from './user-zeit.ts';

const dateTimeStringSchema = z.string().datetime();
export type ZeitSchema = z.infer<typeof dateTimeStringSchema>;
export type Period = { startsAt: UserZeit; endsAt: UserZeit; in_days: number };
export type Interval = 'MONTHLY' | 'YEARLY';

/**
 * Represents a Zeit (time) object with timezone awareness.
 * This class serves as a factory for creating UserZeit and DatabaseZeit instances.
 */
export class Zeit {
  /**
   * Creates a new Zeit instance.
   * @param timezone The timezone for this Zeit instance.
   */
  constructor(private timezone: z.infer<typeof TimezoneSchema>) {}

  /**
   * Creates a new Zeit instance with the specified user timezone.
   * @param zone The user's timezone.
   * @returns A new Zeit instance.
   */
  static withUserZone(zone: z.infer<typeof TimezoneSchema>): Zeit {
    return new Zeit(zone);
  }

  /**
   * Creates a new UserZeit instance with the specified user time and timezone.
   * @param userZeit The user's time as a string in ISO 8601 format.
   * @param zone The user's timezone.
   * @returns A new UserZeit instance.
   */
  static withUserZeit(userZeit: ZeitSchema, zone: z.infer<typeof TimezoneSchema>): UserZeit {
    return new Zeit(zone).fromUser(userZeit);
  }

  /**
   * Creates a UserZeit instance from a user time string.
   * @param zeit The user's time as a string in ISO 8601 format.
   * @returns A new UserZeit instance.
   */
  fromUser(zeit: ZeitSchema): UserZeit {
    return new UserZeit(this.getLuxonDateTime(zeit, this.timezone));
  }

  /**
   * Creates a DatabaseZeit instance from a database time string.
   * @param zeit The database time as a string in ISO 8601 format.
   * @returns A new DatabaseZeit instance.
   */
  fromDatabase(zeit: ZeitSchema): DatabaseZeit {
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
