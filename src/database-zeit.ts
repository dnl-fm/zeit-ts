import { assertEquals } from 'assert/equals';
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
   * @param userTimezone The user's timezone.
   */
  constructor(private dateTime: DateTime, private userTimezone: Timezone) {}

  /**
   * Gets the Luxon DateTime object for this DatabaseZeit.
   * @returns The Luxon DateTime object.
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
   * Converts this DatabaseZeit to a UserZeit in the user's timezone.
   * @returns A new UserZeit instance.
   * @throws {Error} If the resulting date is invalid.
   */
  toUser(): UserZeit {
    const userZeit = this.dateTime.setZone(this.userTimezone);
    assertEquals(userZeit.isValid, true, 'Invalid date');

    return new UserZeit(userZeit);
  }
}
