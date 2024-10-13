import { assertEquals } from 'assert/equals';
import { Cycles } from './cycles.ts';
import { DatabaseZeit } from './database-zeit.ts';
import { DateTime } from './luxon-proxy.ts';
import { Timezone } from './timezone.ts';
import type { Interval, Period, ZeitSchema } from './zeit.ts';

/**
 * Represents a Zeit (time) object in the user's timezone.
 */
export class UserZeit {
  /**
   * Creates a new UserZeit instance.
   * @param dateTime The Luxon DateTime object representing the time in the user's timezone.
   */
  constructor(private dateTime: DateTime) {}

  /**
   * Gets the Luxon DateTime object for this UserZeit.
   * @returns The Luxon DateTime object.
   */
  getZeit(): DateTime {
    return this.dateTime;
  }

  /**
   * Gets the timezone of this UserZeit.
   * @returns The timezone.
   */
  getTimezone(): Timezone {
    return this.dateTime.zone.name as Timezone;
  }

  /**
   * Converts this UserZeit to a DatabaseZeit in UTC.
   * @returns A new DatabaseZeit instance.
   * @throws {Error} If the resulting date is invalid.
   */
  toDatabase(): DatabaseZeit {
    const databaseZeit = this.dateTime.setZone(Timezone.UTC);
    assertEquals(databaseZeit.isValid, true, 'Invalid date');

    return new DatabaseZeit(databaseZeit, this.getTimezone());
  }

  /**
   * Generates cycles starting from this UserZeit.
   * @param numberOfCycles The number of cycles to generate.
   * @param options Options for cycle generation.
   * @param options.interval The interval for cycle generation (default: 'MONTHLY').
   * @returns A new Cycles instance.
   */
  cycles(numberOfCycles: number, options: { interval: Interval } = { interval: 'MONTHLY' }): Cycles {
    const periods: Period[] = [];

    for (let i = 0; i < numberOfCycles; i++) {
      const startsAt = this.cycleStartsAt(options.interval, i);
      const endsAt = this.cycleEndsAt(options.interval, i);

      periods.push({
        startsAt,
        endsAt,
        in_days: endsAt.getZeit().diff(startsAt.getZeit(), 'days').days,
      });
    }

    return Cycles.fromPeriods(periods);
  }

  /**
   * Generates cycles starting from this UserZeit until a specified end date.
   * @param endDate The end date for cycle generation.
   * @param options Options for cycle generation.
   * @param options.interval The interval for cycle generation (default: 'MONTHLY').
   * @returns A new Cycles instance.
   */
  cyclesUntil(endDate: ZeitSchema, options: { interval: Interval } = { interval: 'MONTHLY' }): Cycles {
    const periods: Period[] = [];
    const untilZeit = DateTime.fromISO(endDate, { zone: this.getTimezone() });

    let i = 0;
    while (true) {
      const startsAt = this.cycleStartsAt(options.interval, i);
      const endsAt = this.cycleEndsAt(options.interval, i);

      const period = {
        startsAt,
        endsAt,
        in_days: endsAt.getZeit().diff(startsAt.getZeit(), 'days').days,
      };

      periods.push(period);

      if (period.endsAt.getZeit() >= untilZeit) {
        break;
      }
      i++;
    }

    return Cycles.fromPeriods(periods);
  }

  /**
   * Generates a cycle start date.
   * @param interval The interval for cycle generation.
   * @param iteration The iteration number.
   * @returns A new UserZeit object representing the cycle start date.
   * @throws {Error} If the resulting date is invalid.
   * @private
   */
  private cycleStartsAt(interval: Interval, iteration: number): UserZeit {
    const newZeit = interval === 'MONTHLY' ? this.getZeit().plus({ months: iteration }) : this.getZeit().plus({ years: iteration });

    assertEquals(newZeit.isValid, true, 'Invalid date');
    return new UserZeit(newZeit);
  }

  /**
   * Generates a cycle end date.
   * @param interval The interval for cycle generation.
   * @param iteration The iteration number.
   * @returns A new UserZeit object representing the cycle end date.
   * @throws {Error} If the resulting date is invalid.
   * @private
   */
  private cycleEndsAt(interval: Interval, iteration: number): UserZeit {
    const newZeit = interval === 'MONTHLY' ? this.getZeit().plus({ months: 1 + iteration }) : this.getZeit().plus({ years: 1 + iteration });

    assertEquals(newZeit.isValid, true, 'Invalid date');
    return new UserZeit(newZeit.minus({ seconds: 1 }));
  }
}
