import { assertNotEquals } from 'assert/not-equals';
import { UserZeit } from '../mod.ts';
import { DateTime } from './luxon-proxy.ts';
import type { ZeitPeriod, ZeitSchema } from './zeit.ts';

/**
 * Represents a collection of time periods (cycles).
 */
export class Cycles {
  /**
   * Creates a new Cycles instance from an array of periods.
   * @param periods - An array of ZeitPeriod objects.
   * @returns A new Cycles instance.
   */
  static fromPeriods(periods: ZeitPeriod[]): Cycles {
    return new Cycles(periods);
  }

  /**
   * Creates a new Cycles instance.
   * @param periods - An array of ZeitPeriod objects.
   */
  constructor(private periods: ZeitPeriod[]) {}

  /**
   * Gets all periods in this Cycles instance.
   * @returns An array of ZeitPeriod objects.
   */
  getPeriods(): ZeitPeriod[] {
    return this.periods;
  }

  /**
   * Gets the first period in this Cycles instance.
   * @returns The first ZeitPeriod object.
   */
  getFirstPeriod(): ZeitPeriod {
    return this.periods[0];
  }

  /**
   * Gets the last period in this Cycles instance.
   * @returns The last ZeitPeriod object.
   */
  getLastPeriod(): ZeitPeriod {
    return this.periods[this.periods.length - 1];
  }

  /**
   * Gets the period that contains the specified date.
   * @param zeit - The date to find the period for.
   * @returns The matching ZeitPeriod object, or undefined if no period contains the date.
   */
  getPeriodByZeit(zeit: ZeitSchema): ZeitPeriod | undefined {
    const userZeit = this.getUserZeit(zeit);
    return this.periods.find((period) => {
      return period.startsAt.isSameOrBefore(userZeit) && period.endsAt.isSameOrAfter(userZeit);
    });
  }

  /**
   * Gets the period at the specified index.
   * @param index - The index of the period to get.
   * @returns The ZeitPeriod object at the specified index.
   */
  getPeriodByIndex(index: number): ZeitPeriod {
    return this.periods[index];
  }

  /**
   * Gets the total number of periods in this Cycles instance.
   * @returns The number of periods.
   */
  getNumberOfPeriods(): number {
    return this.periods.length;
  }

  /**
   * Finds the period that contains the given date.
   * @param zeit - The date to search for, as a ZeitSchema. If not provided, the current date and time will be used.
   * @returns The Period object containing the date.
   * @throws {Error} If no period is found containing the given date.
   */
  findPeriod(zeit?: ZeitSchema): ZeitPeriod {
    if (!zeit) {
      zeit = this.getCurrentDateTime().toISO() as string;
    }
    const userZeit = this.getUserZeit(zeit);
    const period = this.periods.find((period) =>
      period.startsAt.getZeit() <= userZeit.getZeit() &&
      period.endsAt.getZeit() >= userZeit.getZeit()
    );
    assertNotEquals(period, undefined, 'Period not found');
    return period as ZeitPeriod;
  }

  /**
   * Finds the nearest period before the given date.
   * @param zeit - The reference date, as a ZeitSchema. If not provided, the current date and time will be used.
   * @returns The nearest Period object before the date.
   * @throws {Error} If no period is found before the given date.
   */
  findBefore(zeit?: ZeitSchema): ZeitPeriod {
    if (!zeit) {
      zeit = this.getCurrentDateTime().toISO() as string;
    }
    const userZeit = this.getUserZeit(zeit);
    const period = this.periods.reverse().find((period) => period.endsAt.getZeit() < userZeit.getZeit());
    assertNotEquals(period, undefined, 'Period not found');
    return period as ZeitPeriod;
  }

  /**
   * Finds the nearest period after the given date.
   * @param zeit - The reference date, as a ZeitSchema. If not provided, the current date and time will be used.
   * @returns The nearest Period object after the date.
   * @throws {Error} If no period is found after the given date.
   */
  findAfter(zeit?: ZeitSchema): ZeitPeriod {
    if (!zeit) {
      zeit = this.getCurrentDateTime().toISO() as string;
    }
    const userZeit = this.getUserZeit(zeit);
    const period = this.periods.find((period) => period.startsAt.getZeit() > userZeit.getZeit());
    assertNotEquals(period, undefined, 'Period not found');
    return period as ZeitPeriod;
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
