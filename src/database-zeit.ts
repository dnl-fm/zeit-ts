import { assertEquals } from 'assert/equals';
import { DateTime } from 'luxon';
import { z } from 'zod';
import type { TimezoneSchema } from './timezone.ts';
import { UserZeit } from './user-zeit.ts';

/**
 * Represents a Zeit (time) object in the database timezone (UTC).
 */
export class DatabaseZeit {
  /**
   * Creates a new DatabaseZeit instance.
   * @param dateTime The Luxon DateTime object representing the time in UTC.
   * @param userZone The user's timezone.
   */
  constructor(private dateTime: DateTime, private userZone: z.infer<typeof TimezoneSchema>) {}

  /**
   * Gets the Luxon DateTime object for this DatabaseZeit.
   * @returns The Luxon DateTime object.
   */
  getZeit() {
    return this.dateTime;
  }

  /**
   * Gets the timezone of this DatabaseZeit (always UTC).
   * @returns The UTC timezone.
   */
  getTimezone() {
    return this.dateTime.zone;
  }

  /**
   * Converts this DatabaseZeit to a UserZeit in the user's timezone.
   * @returns A new UserZeit instance.
   */
  toUser() {
    const userZeit = this.dateTime.setZone(this.userZone);
    assertEquals(userZeit.isValid, true, 'Invalid date');

    return new UserZeit(userZeit);
  }
}
