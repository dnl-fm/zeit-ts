import { assertEquals } from 'assert/equals';
import { assertInstanceOf } from 'assert/instance-of';
import type { DateObjectUnits, DurationLike } from 'npm:@types/luxon@3';
import { Cycles } from './cycles.ts';
import { DatabaseZeit } from './database-zeit.ts';
import { DateTime } from './luxon-proxy.ts';
import { Timezone } from './timezone.ts';
import type { ZeitInterval, ZeitPeriod } from './zeit.ts';

/**
 * Represents a Zeit (time) object in the user's timezone.
 */
export class UserZeit {
  static clone(zeit: UserZeit): UserZeit {
    return new UserZeit(zeit.getZeit());
  }

  /**
   * Creates a UserZeit instance representing the current time in the specified timezone.
   * @param timezone - The timezone to use.
   * @param now - Optional DateTime object representing the current time.
   * @returns A new UserZeit instance.
   */
  static fromNow(timezone: Timezone, now?: DateTime) {
    if (!now) now = DateTime.now();
    return new UserZeit(now.setZone(timezone), now);
  }

  /**
   * Sorts an array of objects containing UserZeit properties.
   * @param items - An array of objects containing UserZeit properties.
   * @param key - The key of the UserZeit property to sort by.
   * @param direction - The sorting direction: 'asc' for ascending, 'desc' for descending.
   * @returns A new array of sorted objects.
   */
  static sortObjects<T extends { [key: string]: unknown }>(items: T[], key: keyof T & string, direction: 'asc' | 'desc' = 'asc'): T[] {
    return [...items].sort((a, b) => {
      const aZeit = a[key];
      const bZeit = b[key];

      assertInstanceOf(aZeit, UserZeit, `Property "${key}" is not a UserZeit instance`);
      assertInstanceOf(bZeit, UserZeit, `Property "${key}" is not a UserZeit instance`);

      const comparison = aZeit.getZeit().diff(bZeit.getZeit()).toMillis();
      return direction === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * Creates a new UserZeit instance.
   * @param dateTime - The Luxon DateTime object representing the time in the user's timezone.
   * @param now - Optional DateTime object representing the current time.
   */
  constructor(private dateTime: DateTime, private now?: DateTime) {
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
   * Checks if the DateTime is valid.
   * @returns True if the DateTime is valid, false otherwise.
   */
  isValid() {
    return this.dateTime.isValid;
  }

  /**
   * Sets specified components of the date/time.
   * @param values - An object containing the components to set and their values.
   * @returns This UserZeit instance for method chaining.
   */
  set(values: DateObjectUnits): UserZeit {
    this.dateTime = this.getZeit().set(values);
    return this;
  }

  /**
   * Subtracts a duration from the current time.
   * @param duration - The duration to subtract.
   * @returns This UserZeit instance for method chaining.
   */
  minus(duration: DurationLike): UserZeit {
    this.dateTime = this.getZeit().minus(duration);
    return this;
  }

  /**
   * Adds a duration to the current time.
   * @param duration - The duration to add.
   * @returns This UserZeit instance for method chaining.
   */
  plus(duration: DurationLike): UserZeit {
    this.dateTime = this.getZeit().plus(duration);
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
   * Calculates the number of days between this UserZeit and another UserZeit.
   * @param otherZeit - The UserZeit to calculate the difference to.
   * @returns The number of days between the two UserZeit objects.
   */
  daysBetween(otherZeit: UserZeit): number {
    const thisDate = this.setToMidnight().getZeit();
    const otherDate = otherZeit.setToMidnight().getZeit();

    // ensure same timezone
    const thisInUTC = thisDate.toUTC();
    const otherInUTC = otherDate.toUTC();

    // ensure positive difference
    return Math.abs(thisInUTC.diff(otherInUTC, 'days').days);
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
   * @param numberOfCycles - The number of cycles to generate.
   * @param options - Options for cycle generation.
   * @returns A new Cycles instance containing the generated cycles.
   */
  cycles(numberOfCycles: number, options: { interval: ZeitInterval; startZeit?: UserZeit } = { interval: 'MONTHLY' }): Cycles {
    const periods: ZeitPeriod[] = [];

    for (let i = 0; i < numberOfCycles; i++) {
      const startsAt = this.cycleStartsAt(options.interval, i, options.startZeit);
      const endsAt = this.cycleEndsAt(options.interval, i, options.startZeit);
      periods.push(this.buildPeriod(startsAt, endsAt));
    }

    return Cycles.fromPeriods(periods);
  }

  /**
   * Generates cycles starting from a specified date.
   * @param startZeit - The start date for cycle generation.
   * @param numberOfCycles - The number of cycles to generate.
   * @param options - Options for cycle generation.
   * @returns A new Cycles instance.
   */
  cyclesFrom(startZeit: UserZeit, numberOfCycles: number, options: { interval: ZeitInterval } = { interval: 'MONTHLY' }): Cycles {
    const validCycles = this.cyclesUntil(startZeit, { interval: options.interval });
    const isValid = validCycles.getPeriods().some((period) => period.startsAt.isSameDate(startZeit));
    assertEquals(isValid, true, 'Invalid start date');
    return this.cycles(numberOfCycles, { ...options, startZeit });
  }

  /**
   * Generates cycles starting from this UserZeit until a specified end date.
   * @param endZeit - The end date for cycle generation.
   * @param options - Options for cycle generation.
   * @returns A new Cycles instance.
   */
  cyclesUntil(endZeit: UserZeit, options: { interval: ZeitInterval } = { interval: 'MONTHLY' }): Cycles {
    const periods: ZeitPeriod[] = [];

    let i = 0;
    while (true) {
      const startsAt = this.cycleStartsAt(options.interval, i);
      const endsAt = this.cycleEndsAt(options.interval, i);

      const period = this.buildPeriod(startsAt, endsAt);
      periods.push(period);

      if (period.endsAt.isSameOrAfter(endZeit)) {
        break;
      }
      i++;
    }

    return Cycles.fromPeriods(periods);
  }

  /**
   * Gets the previous cycle based on the current date.
   * @param interval - The interval for cycle calculation.
   * @param startsAt - Optional start date for the cycle. If not provided, uses the current UserZeit.
   * @returns A Period object representing the previous cycle.
   */
  previousCycle(interval: ZeitInterval = 'MONTHLY', startsAt?: UserZeit): ZeitPeriod {
    let fromZeit = this.getNow();
    if (startsAt) fromZeit = UserZeit.clone(startsAt);
    const previousIntervalZeit = interval === 'MONTHLY' ? fromZeit.minus({ months: 1 }) : fromZeit.minus({ years: 1 });
    return this.cyclesUntil(previousIntervalZeit, { interval }).getLastPeriod();
  }

  /**
   * Gets the current cycle based on the current date.
   * @param interval - The interval for cycle calculation.
   * @returns A Period object representing the current cycle.
   */
  currentCycle(interval: ZeitInterval = 'MONTHLY'): ZeitPeriod {
    return this.cyclesUntil(this.getNow(), { interval }).getLastPeriod();
  }

  /**
   * Gets the next cycle based on the current date.
   * @param interval - The interval for cycle calculation.
   * @param startsAt - Optional start date for the cycle. If not provided, uses the current UserZeit.
   * @returns A Period object representing the next cycle.
   */
  nextCycle(interval: ZeitInterval = 'MONTHLY', startsAt?: UserZeit): ZeitPeriod {
    let fromZeit = this.getNow();
    if (startsAt) fromZeit = UserZeit.clone(startsAt);
    const nextIntervalZeit = interval === 'MONTHLY' ? fromZeit.plus({ months: 1 }) : fromZeit.plus({ years: 1 });
    return this.cyclesUntil(nextIntervalZeit, { interval }).getLastPeriod();
  }

  /**
   * Generates a cycle start date.
   * @param interval - The interval for cycle generation (MONTHLY or YEARLY).
   * @param iteration - The number of intervals to add to the start date.
   * @param startsAt - Optional start date for the cycle. If not provided, uses the current UserZeit.
   * @returns A new UserZeit object representing the cycle start date.
   * @private
   */
  private cycleStartsAt(interval: ZeitInterval, iteration: number, startsAt?: UserZeit): UserZeit {
    const newZeit = this.buildCycle(interval, iteration, startsAt);
    return new UserZeit(newZeit);
  }

  /**
   * Generates a cycle end date.
   * @param interval - The interval for cycle generation (MONTHLY or YEARLY).
   * @param iteration - The number of intervals to add to the start date.
   * @param startsAt - Optional start date for the cycle. If not provided, uses the current UserZeit.
   * @returns A new UserZeit object representing the cycle end date (one millisecond before the next cycle starts).
   * @private
   */
  private cycleEndsAt(interval: ZeitInterval, iteration: number, startsAt?: UserZeit): UserZeit {
    const newZeit = this.buildCycle(interval, iteration + 1, startsAt);
    return new UserZeit(newZeit.minus({ milliseconds: 1 }));
  }

  /**
   * Builds a ZeitPeriod object from start and end dates.
   * @param startsAt - The start date of the period.
   * @param endsAt - The end date of the period.
   * @returns A ZeitPeriod object containing start and end dates, and the duration in days.
   * @private
   */
  private buildPeriod(startsAt: UserZeit, endsAt: UserZeit): ZeitPeriod {
    const durationInDays = Math.round(endsAt.getZeit().diff(startsAt.getZeit(), 'days').days);
    return { startsAt, endsAt, durationInDays };
  }

  /**
   * Builds a cycle DateTime object.
   * @param interval - The interval for cycle generation (MONTHLY or YEARLY).
   * @param iteration - The number of intervals to add to the start date.
   * @param startsAt - Optional start date for the cycle. If not provided, uses the current UserZeit.
   * @returns A new DateTime object representing the cycle.
   * @throws {Error} If the resulting date is invalid.
   * @private
   */
  private buildCycle(interval: ZeitInterval, iteration: number, startsAt?: UserZeit): DateTime {
    const zeit = startsAt ? startsAt.getZeit() : this.getZeit();
    const newZeit = interval === 'MONTHLY' ? zeit.plus({ months: iteration }) : zeit.plus({ years: iteration });
    assertEquals(newZeit.isValid, true, 'Invalid date');
    return newZeit;
  }

  /**
   * Gets the current DateTime, either from the stored 'now' value or creates a new one.
   * @returns A UserZeit object representing the current time in the user's timezone.
   * @throws {Error} If the resulting date is invalid.
   * @private
   */
  private getNow(): UserZeit {
    const nowZeit = UserZeit.fromNow(this.getTimezone(), this.now);
    assertEquals(nowZeit.isValid(), true, 'Invalid date');
    return nowZeit;
  }
}
