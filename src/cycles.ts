import { assertNotEquals } from 'assert/not-equals';
import { UserZeit } from '../mod.ts';
import { DateTime } from './luxon-proxy.ts';
import type { Period, ZeitSchema } from './zeit.ts';

/**
 * Represents a collection of time periods (cycles).
 */
export class Cycles {
  /**
   * Creates a new Cycles instance.
   * @param periods - An array of Period objects representing the time cycles.
   */
  constructor(private periods: Period[]) {}

  /**
   * Creates a new Cycles instance from an array of periods.
   * @param periods - An array of Period objects.
   * @returns A new Cycles instance.
   */
  static fromPeriods(periods: Period[]): Cycles {
    return new Cycles(periods);
  }

  /**
   * Retrieves all periods in this Cycles instance.
   * @returns An array of Period objects.
   */
  getPeriods(): Period[] {
    return this.periods;
  }

  /**
   * Gets the total number of periods in this Cycles instance.
   * @returns The number of periods.
   */
  getNumberOfPeriods(): number {
    return this.periods.length;
  }

  /**
   * Retrieves the first period in this Cycles instance.
   * @returns The first Period object.
   * @throws {Error} If there are no periods in the Cycles instance.
   */
  getFirstPeriod(): Period {
    if (this.periods.length === 0) {
      throw new Error('No periods in Cycles');
    }
    return this.periods[0];
  }

  /**
   * Retrieves the last period in this Cycles instance.
   * @returns The last Period object.
   * @throws {Error} If there are no periods in the Cycles instance.
   */
  getLastPeriod(): Period {
    if (this.periods.length === 0) {
      throw new Error('No periods in Cycles');
    }
    return this.periods[this.periods.length - 1];
  }

  /**
   * Finds the period that contains the given date.
   * @param zeit - The date to search for, as a ZeitSchema. If not provided, the current date and time will be used.
   * @returns The Period object containing the date.
   * @throws {Error} If no period is found containing the given date.
   */
  findPeriod(zeit?: ZeitSchema): Period {
    if (!zeit) {
      zeit = this.getCurrentDateTime().toISO() as string;
    }
    const userZeit = this.getUserZeit(zeit);
    const period = this.periods.find((period) =>
      period.startsAt.getZeit() <= userZeit.getZeit() &&
      period.endsAt.getZeit() >= userZeit.getZeit()
    );
    assertNotEquals(period, undefined, 'Period not found');
    return period as Period;
  }

  /**
   * Finds the nearest period before the given date.
   * @param zeit - The reference date, as a ZeitSchema. If not provided, the current date and time will be used.
   * @returns The nearest Period object before the date.
   * @throws {Error} If no period is found before the given date.
   */
  findBefore(zeit?: ZeitSchema): Period {
    if (!zeit) {
      zeit = this.getCurrentDateTime().toISO() as string;
    }
    const userZeit = this.getUserZeit(zeit);
    const period = this.periods.reverse().find((period) => period.endsAt.getZeit() < userZeit.getZeit());
    assertNotEquals(period, undefined, 'Period not found');
    return period as Period;
  }

  /**
   * Finds the nearest period after the given date.
   * @param zeit - The reference date, as a ZeitSchema. If not provided, the current date and time will be used.
   * @returns The nearest Period object after the date.
   * @throws {Error} If no period is found after the given date.
   */
  findAfter(zeit?: ZeitSchema): Period {
    if (!zeit) {
      zeit = this.getCurrentDateTime().toISO() as string;
    }
    const userZeit = this.getUserZeit(zeit);
    const period = this.periods.find((period) => period.startsAt.getZeit() > userZeit.getZeit());
    assertNotEquals(period, undefined, 'Period not found');
    return period as Period;
  }

  /**
   * Converts a ZeitSchema to a UserZeit object.
   * @param zeit - The ZeitSchema to convert.
   * @returns A UserZeit object.
   * @private
   */
  private getUserZeit(zeit: ZeitSchema): UserZeit {
    const dateTime = DateTime.fromISO(zeit, { zone: this.periods[0].startsAt.getTimezone() });
    return new UserZeit(dateTime);
  }

  /**
   * Gets the current date and time in the timezone of the first period.
   * @returns A DateTime object representing the current date and time.
   * @private
   */
  private getCurrentDateTime(): DateTime {
    return DateTime.now().setZone(this.periods[0].startsAt.getTimezone());
  }
}
