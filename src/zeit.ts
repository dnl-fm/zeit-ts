// @deno-types="npm:@types/luxon"
import { DateTime } from 'luxon';
import { z } from 'zod';
import { DatabaseZeit } from './database-zeit.ts';
import { Timezone, type TimezoneSchema } from './timezone.ts';
import { UserZeit } from './user-zeit.ts';

const dateTimeStringSchema = z.string().datetime();
export type ZeitSchema = z.infer<typeof dateTimeStringSchema>;
export type Period = { startsAt: UserZeit; endsAt: UserZeit };
export type Interval = 'MONTHLY' | 'YEARLY';

/**
 * Represents a Zeit (time) object with timezone awareness.
 */
export class Zeit {
  /**
   * Creates a new Zeit instance.
   * @param zone The timezone for this Zeit instance.
   */
  constructor(private zone: z.infer<typeof TimezoneSchema>) {}

  /**
   * Creates a new Zeit instance with the specified user timezone.
   * @param zone The user's timezone.
   * @returns A new Zeit instance.
   */
  static withUserZone(zone: z.infer<typeof TimezoneSchema>) {
    return new Zeit(zone);
  }

  /**
   * Creates a new Zeit instance with the specified user time and timezone.
   * @param userZeit The user's time as a string.
   * @param zone The user's timezone.
   * @returns A new UserZeit instance.
   */
  static withUserZeit(userZeit: ZeitSchema, zone: z.infer<typeof TimezoneSchema>) {
    return new Zeit(zone).fromUser(userZeit);
  }

  /**
   * Creates a UserZeit instance from a user time string.
   * @param zeit The user's time as a string.
   * @returns A new UserZeit instance.
   */
  fromUser(zeit: ZeitSchema) {
    return new UserZeit(this.getLuxonDateTime(zeit, this.zone));
  }

  /**
   * Creates a DatabaseZeit instance from a database time string.
   * @param zeit The database time as a string.
   * @returns A new DatabaseZeit instance.
   */
  fromDatabase(zeit: ZeitSchema) {
    return new DatabaseZeit(this.getLuxonDateTime(zeit, Timezone.UTC), this.zone);
  }

  /**
   * Gets the timezone of this Zeit instance.
   * @returns The timezone.
   */
  getTimezone() {
    return this.zone;
  }

  /**
   * Creates a Luxon DateTime object from a date string and timezone.
   * @param date The date string.
   * @param timeZone The timezone.
   * @returns A Luxon DateTime object.
   */
  private getLuxonDateTime(date: ZeitSchema, timeZone: z.infer<typeof TimezoneSchema>) {
    return DateTime.fromISO(date, { zone: timeZone });
  }
}
