import type { Period, ZeitSchema } from './zeit.ts';

/**
 * Represents a collection of time periods (cycles).
 */
export class Cycles {
  /**
   * Creates a new Cycles instance.
   * @param periods An array of Period objects.
   */
  constructor(private periods: Period[]) {}

  /**
   * Creates a new Cycles instance from an array of periods.
   * @param periods An array of Period objects.
   * @returns A new Cycles instance.
   */
  static fromPeriods(periods: Period[]) {
    return new Cycles(periods);
  }

  /**
   * Gets all periods in this Cycles instance.
   * @returns An array of Period objects.
   */
  getPeriods() {
    return this.periods;
  }

  /**
   * Gets the number of periods in this Cycles instance.
   * @returns The number of periods.
   */
  getNumberOfPeriods() {
    return this.periods.length;
  }

  /**
   * Gets the first period in this Cycles instance.
   * @returns The first Period object.
   */
  getFirstPeriod() {
    return this.periods[0];
  }

  /**
   * Gets the last period in this Cycles instance.
   * @returns The last Period object.
   */
  getLastPeriod() {
    return this.periods[this.periods.length - 1];
  }

  /**
   * Finds the period that contains the given date.
   * @param date The date to search for.
   * @returns The Period object containing the date, or undefined if not found.
   */
  findPeriod(date: ZeitSchema) {
    // ... (implementation details)
  }
}
