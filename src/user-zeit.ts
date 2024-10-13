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
  constructor(private dateTime: DateTime, private now?: DateTime) {}

  /**
   * Gets the Luxon DateTime object for this UserZeit.
   * @returns The Luxon DateTime object.
   */
  getZeit(): DateTime {
    return this.dateTime;
  }

  /**
   * Gets the timezone of this UserZeit.
   * @returns The timezone as a Timezone enum value.
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
   * @param [options.startsAt] Optional start date for the cycles.
   * @returns A new Cycles instance.
   */
  cycles(numberOfCycles: number, options: { interval: Interval; startsAt?: ZeitSchema } = { interval: 'MONTHLY' }): Cycles {
    const periods: Period[] = [];

    for (let i = 0; i < numberOfCycles; i++) {
      const startsAt = this.cycleStartsAt(options.interval, i, options.startsAt);
      const endsAt = this.cycleEndsAt(options.interval, i, options.startsAt);
      periods.push(this.buildPeriod(startsAt, endsAt));
    }

    return Cycles.fromPeriods(periods);
  }

  /**
   * Generates cycles starting from a specified date.
   * @param startsAt The start date for cycle generation.
   * @param numberOfCycles The number of cycles to generate.
   * @param options Options for cycle generation.
   * @param options.interval The interval for cycle generation (default: 'MONTHLY').
   * @returns A new Cycles instance.
   */
  cyclesFrom(startsAt: ZeitSchema, numberOfCycles: number, options: { interval: Interval } = { interval: 'MONTHLY' }): Cycles {
    const startsAtZeit = DateTime.fromISO(startsAt, { zone: this.getTimezone() });
    const validCycles = this.cyclesUntil(startsAt, { interval: options.interval });
    const isValid = validCycles.getPeriods().some((period) => period.startsAt.getZeit().equals(startsAtZeit));
    assertEquals(isValid, true, 'Invalid start date');
    return this.cycles(numberOfCycles, { ...options, startsAt });
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

      const period = this.buildPeriod(startsAt, endsAt);
      periods.push(period);

      if (period.endsAt.getZeit() >= untilZeit) {
        break;
      }
      i++;
    }

    return Cycles.fromPeriods(periods);
  }

  /**
   * Gets the previous cycle based on the current date.
   * @param interval The interval for cycle calculation (default: 'MONTHLY').
   * @returns A Period object representing the previous cycle.
   */
  previousCycle(interval: Interval = 'MONTHLY'): Period {
    const now = this.getNow();
    const previousIntervalDate = interval === 'MONTHLY' ? now.minus({ months: 1 }) : now.minus({ years: 1 });
    return this.cyclesUntil(previousIntervalDate.toISO() as string, { interval }).getLastPeriod();
  }

  /**
   * Gets the current cycle based on the current date.
   * @param interval The interval for cycle calculation (default: 'MONTHLY').
   * @returns A Period object representing the current cycle.
   */
  currentCycle(interval: Interval = 'MONTHLY'): Period {
    const now = this.getNow();
    return this.cyclesUntil(now.toISO() as string, { interval }).getLastPeriod();
  }

  /**
   * Gets the next cycle based on the current date.
   * @param interval The interval for cycle calculation (default: 'MONTHLY').
   * @returns A Period object representing the next cycle.
   */
  nextCycle(interval: Interval = 'MONTHLY'): Period {
    const now = this.getNow();
    const nextIntervalDate = interval === 'MONTHLY' ? now.plus({ months: 1 }) : now.plus({ years: 1 });
    return this.cyclesUntil(nextIntervalDate.toISO() as string, { interval }).getLastPeriod();
  }

  private getNow(): DateTime {
    const now = this.now ?? DateTime.fromISO(DateTime.now().toISO(), { zone: this.getTimezone() });
    console.log(now, this.now);
    assertEquals(now.isValid, true, 'Invalid date');
    return now;
  }

  /**
   * Generates a cycle start date.
   * @param interval The interval for cycle generation.
   * @param iteration The iteration number.
   * @param [startsAt] Optional start date for the cycle.
   * @returns A new UserZeit object representing the cycle start date.
   * @throws {Error} If the resulting date is invalid.
   * @private
   */
  private cycleStartsAt(interval: Interval, iteration: number, startsAt?: ZeitSchema): UserZeit {
    const newZeit = this.buildCycle(interval, iteration, startsAt);
    return new UserZeit(newZeit);
  }

  /**
   * Generates a cycle end date.
   * @param interval The interval for cycle generation.
   * @param iteration The iteration number.
   * @param [startsAt] Optional start date for the cycle.
   * @returns A new UserZeit object representing the cycle end date.
   * @throws {Error} If the resulting date is invalid.
   * @private
   */
  private cycleEndsAt(interval: Interval, iteration: number, startsAt?: ZeitSchema): UserZeit {
    const newZeit = this.buildCycle(interval, iteration + 1, startsAt);
    return new UserZeit(newZeit.minus({ milliseconds: 1 }));
  }

  /**
   * Builds a Period object from start and end dates.
   * @param startsAt The start date of the period.
   * @param endsAt The end date of the period.
   * @returns A Period object.
   * @private
   */
  private buildPeriod(startsAt: UserZeit, endsAt: UserZeit) {
    const durationInDays = Math.round(endsAt.getZeit().diff(startsAt.getZeit(), 'days').days);
    return { startsAt, endsAt, durationInDays };
  }

  /**
   * Builds a cycle DateTime object.
   * @param interval The interval for cycle generation.
   * @param iteration The iteration number.
   * @param [startsAt] Optional start date for the cycle.
   * @returns A new DateTime object representing the cycle.
   * @throws {Error} If the resulting date is invalid.
   * @private
   */
  private buildCycle(interval: Interval, iteration: number, startsAt?: ZeitSchema): DateTime {
    let zeit = this.getZeit();
    if (startsAt) zeit = DateTime.fromISO(startsAt, { zone: this.getTimezone() });
    const newZeit = interval === 'MONTHLY' ? zeit.plus({ months: iteration }) : zeit.plus({ years: iteration });
    assertEquals(newZeit.isValid, true, 'Invalid date');
    return newZeit;
  }
}
