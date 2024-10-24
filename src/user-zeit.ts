import { assertEquals } from 'assert/equals';
import type { DateObjectUnits } from 'npm:@types/luxon@3';
import { Cycles } from './cycles.ts';
import { DatabaseZeit } from './database-zeit.ts';
import { DateTime } from './luxon-proxy.ts';
import { Timezone } from './timezone.ts';
import type { ZeitInterval, ZeitPeriod, ZeitSchema } from './zeit.ts';

/**
 * Represents a Zeit (time) object in the user's timezone.
 */
export class UserZeit {
  /**
   * Creates a new UserZeit instance.
   * @param dateTime The Luxon DateTime object representing the time in the user's timezone.
   * @param now Optional DateTime object representing the current time. If not provided, the current time will be used when needed.
   */
  constructor(private dateTime: DateTime, private now?: DateTime) {}

  /**
   * Sets specified components of the date/time.
   * @param values An object containing the components to set and their values.
   * @returns This UserZeit instance for method chaining.
   */
  set(values: DateObjectUnits): UserZeit {
    this.dateTime = this.getZeit().set(values);
    return this;
  }

  /**
   * Sets the time to midnight.
   * @returns This UserZeit instance for method chaining.
   */
  setToMidnight(): UserZeit {
    return this.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  }

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
   * Checks if this UserZeit has the same date as another UserZeit.
   * @param zeit - The UserZeit to compare with.
   * @returns True if the dates are the same, false otherwise.
   */
  isSameDate(zeit: UserZeit): boolean {
    return this.dateTime.hasSame(zeit.getZeit(), 'day');
  }

  /**
   * Checks if this UserZeit is after another UserZeit.
   * @param zeit - The UserZeit to compare with.
   * @returns True if this UserZeit is after the provided UserZeit, false otherwise.
   */
  isAfter(zeit: UserZeit): boolean {
    return this.dateTime > zeit.getZeit();
  }

  /**
   * Checks if this UserZeit is after or the same as another UserZeit.
   * @param zeit - The UserZeit to compare with.
   * @returns True if this UserZeit is after or the same as the provided UserZeit, false otherwise.
   */
  isSameOrAfter(zeit: UserZeit): boolean {
    return this.dateTime >= zeit.getZeit();
  }

  /**
   * Checks if this UserZeit is before another UserZeit.
   * @param zeit - The UserZeit to compare with.
   * @returns True if this UserZeit is before the provided UserZeit, false otherwise.
   */
  isBefore(zeit: UserZeit): boolean {
    return this.dateTime < zeit.getZeit();
  }

  /**
   * Checks if this UserZeit is before or the same as another UserZeit.
   * @param zeit - The UserZeit to compare with.
   * @returns True if this UserZeit is before or the same as the provided UserZeit, false otherwise.
   */
  isSameOrBefore(zeit: UserZeit): boolean {
    return this.dateTime <= zeit.getZeit();
  }

  /**
   * Converts the UserZeit to an ISO 8601 string.
   * @returns The ISO 8601 string representation of the UserZeit.
   */
  toISO(): string {
    return this.dateTime.toISO()!;
  }

  /**
   * Converts the UserZeit to an ISO 8601 date string (without time).
   * @returns The ISO 8601 date string representation of the UserZeit.
   */
  toISODate(): string {
    return this.dateTime.toISODate()!;
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
   * Converts the UserZeit to a DatabaseZeit ISO 8601 string.
   * @returns The ISO 8601 string representation of the DatabaseZeit.
   */
  toDatabaseISO(): string {
    return this.toDatabase().toISO();
  }

  /**
   * Converts the UserZeit to a DatabaseZeit ISO 8601 date string (without time).
   * @returns The ISO 8601 date string representation of the DatabaseZeit.
   */
  toDatabaseISODate(): string {
    return this.toDatabase().toISODate();
  }

  /**
   * Generates cycles starting from this UserZeit.
   * @param numberOfCycles The number of cycles to generate.
   * @param options Options for cycle generation.
   * @param options.interval The interval for cycle generation ('MONTHLY' or 'YEARLY').
   * @param [options.startsAt] Optional start date for the cycles. If not provided, the current UserZeit is used as the start date.
   * @returns A new Cycles instance containing the generated cycles.
   */
  cycles(numberOfCycles: number, options: { interval: ZeitInterval; startsAt?: ZeitSchema } = { interval: 'MONTHLY' }): Cycles {
    const periods: ZeitPeriod[] = [];

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
  cyclesFrom(startsAt: ZeitSchema, numberOfCycles: number, options: { interval: ZeitInterval } = { interval: 'MONTHLY' }): Cycles {
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
  cyclesUntil(endDate: ZeitSchema, options: { interval: ZeitInterval } = { interval: 'MONTHLY' }): Cycles {
    const periods: ZeitPeriod[] = [];
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
   * @param interval The interval for cycle calculation ('MONTHLY' or 'YEARLY', default: 'MONTHLY').
   * @returns A Period object representing the previous cycle.
   */
  previousCycle(interval: ZeitInterval = 'MONTHLY'): ZeitPeriod {
    const now = this.getNow();
    const previousIntervalDate = interval === 'MONTHLY' ? now.minus({ months: 1 }) : now.minus({ years: 1 });
    return this.cyclesUntil(previousIntervalDate.toISO() as string, { interval }).getLastPeriod();
  }

  /**
   * Gets the current cycle based on the current date.
   * @param interval The interval for cycle calculation (default: 'MONTHLY').
   * @returns A Period object representing the current cycle.
   */
  currentCycle(interval: ZeitInterval = 'MONTHLY'): ZeitPeriod {
    const now = this.getNow();
    return this.cyclesUntil(now.toISO() as string, { interval }).getLastPeriod();
  }

  /**
   * Gets the next cycle based on the current date.
   * @param interval The interval for cycle calculation (default: 'MONTHLY').
   * @returns A Period object representing the next cycle.
   */
  nextCycle(interval: ZeitInterval = 'MONTHLY'): ZeitPeriod {
    const now = this.getNow();
    const nextIntervalDate = interval === 'MONTHLY' ? now.plus({ months: 1 }) : now.plus({ years: 1 });
    return this.cyclesUntil(nextIntervalDate.toISO() as string, { interval }).getLastPeriod();
  }

  /**
   * Gets the current DateTime, either from the stored 'now' value or creates a new one.
   * @returns A DateTime object representing the current time in the user's timezone.
   * @throws {Error} If the resulting date is invalid.
   * @private
   */
  private getNow(): DateTime {
    const now = this.now ?? DateTime.fromISO(DateTime.now().toISO(), { zone: this.getTimezone() });
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
  private cycleStartsAt(interval: ZeitInterval, iteration: number, startsAt?: ZeitSchema): UserZeit {
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
  private cycleEndsAt(interval: ZeitInterval, iteration: number, startsAt?: ZeitSchema): UserZeit {
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
  private buildCycle(interval: ZeitInterval, iteration: number, startsAt?: ZeitSchema): DateTime {
    let zeit = this.getZeit();
    if (startsAt) zeit = DateTime.fromISO(startsAt, { zone: this.getTimezone() });
    const newZeit = interval === 'MONTHLY' ? zeit.plus({ months: iteration }) : zeit.plus({ years: iteration });
    assertEquals(newZeit.isValid, true, 'Invalid date');
    return newZeit;
  }
}
