import { assertEquals } from 'assert/equals';
import { DateTime } from 'luxon';
import { Cycles } from './cycles.ts';
import { DatabaseZeit } from './database-zeit.ts';
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
  getZeit() {
    return this.dateTime;
  }

  /**
   * Gets the timezone of this UserZeit.
   * @returns The timezone.
   */
  getTimezone() {
    return this.dateTime.zone;
  }

  /**
   * Converts this UserZeit to a DatabaseZeit in UTC.
   * @returns A new DatabaseZeit instance.
   */
  toDatabase() {
    const databaseZeit = this.dateTime.setZone(Timezone.UTC);
    assertEquals(databaseZeit.isValid, true, 'Invalid date');

    return new DatabaseZeit(databaseZeit, this.getTimezone().name);
  }

  /**
   * Generates cycles starting from this UserZeit.
   * @param numberOfCycles The number of cycles to generate.
   * @param options Options for cycle generation (interval).
   * @returns A new Cycles instance.
   */
  cycles(numberOfCycles: number, options: { interval: Interval } = { interval: 'MONTHLY' }) {
    const periods: Period[] = [];

    let iterations = 0;

    while (iterations < numberOfCycles) {
      periods.push({
        startsAt: this.cycleStartsAt(options.interval, iterations),
        endsAt: this.cycleEndsAt(options.interval, iterations),
      });

      iterations++;
    }

    return Cycles.fromPeriods(periods);
  }

  /**
   * Generates cycles starting from this UserZeit until a specified end date.
   * @param endDate The end date for cycle generation.
   * @param options Options for cycle generation (interval).
   * @returns A new Cycles instance.
   */
  cyclesUntil(endDate: ZeitSchema, options: { interval: Interval } = { interval: 'MONTHLY' }) {
    const periods: Period[] = [];
    const untilZeit = DateTime.fromISO(endDate, { zone: this.getTimezone() });

    let iterations = 0;
    let breakIterations = false;

    while (!breakIterations) {
      periods.push({
        startsAt: this.cycleStartsAt(options.interval, iterations),
        endsAt: this.cycleEndsAt(options.interval, iterations),
      });

      iterations++;

      if (periods[iterations - 1].endsAt.getZeit() >= untilZeit) {
        breakIterations = true;
      }
    }

    return Cycles.fromPeriods(periods);
  }

  /**
   * Generates a single cycle period.
   * @param startDate The start date of the cycle.
   * @param endDate The end date of the cycle.
   * @returns A Period object.
   */
  private generateCyclePeriod(startDate: DateTime, endDate: DateTime): Period {
    return {
      startsAt: startDate,
      endsAt: endDate,
    };
  }

  /**
   * Generates a cycle start date.
   * @param interval The interval for cycle generation.
   * @param iteration The iteration number.
   * @returns A new DateTime object representing the cycle start date.
   */
  private cycleStartsAt(interval: Interval, iteration: number) {
    let newZeit: DateTime;

    switch (interval) {
      case 'MONTHLY':
        newZeit = this.getZeit().plus({ months: iteration });
        break;
      default:
        newZeit = this.getZeit().plus({ years: iteration });
    }

    assertEquals(newZeit.isValid, true, 'Invalid date');

    return new UserZeit(newZeit);
  }

  /**
   * Generates a cycle end date.
   * @param interval The interval for cycle generation.
   * @param iteration The iteration number.
   * @returns A new DateTime object representing the cycle end date.
   */
  private cycleEndsAt(interval: Interval, iteration: number) {
    let newZeit: DateTime;

    switch (interval) {
      case 'MONTHLY':
        newZeit = this.getZeit().plus({ months: 1 + iteration });
        break;
      default:
        newZeit = this.getZeit().plus({ years: 1 + iteration });
    }

    assertEquals(newZeit.isValid, true, 'Invalid date');

    return new UserZeit(newZeit.minus({ seconds: 1 }));
  }
}
