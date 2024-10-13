# Zeit: Simplifying Timezone-Aware DateTime Handling

Zeit is a TypeScript library designed to simplify datetime handling in applications that deal with users across different timezones. It's particularly useful for subscription services, billing systems, and any application where precise timing based on user timezones is crucial.

---

## Why Zeit?

As someone who's built subscription-based services, I've faced the headache of managing time-sensitive operations for users scattered across different timezones. Trust me, it can get messy fast! That's why I created Zeit. It solves these problems by:

1. Clearly separating user timezone from UTC (what I store in my database).
2. Making it a breeze to convert between user time and database time.
3. Handling those tricky timezone-aware calculations for subscription cycles and billing periods.
4. Keeping datetime operations consistent throughout my apps.

---

## How does it work?

Here is a quick example of how to use Zeit:

```typescript
import { Zeit, Timezone } from '@dnl-fm/zeit-ts';

// My user's timezone
const userZone = Timezone.America.New_York;

// I create a Zeit instance for this user's timezone
const zeit = Zeit.withUserZone(userZone);

// Now I can easily work with the user's local time
const userTime = zeit.fromUser("2024-03-01T10:00:00");
// 2024-03-01T10:00:00.000-05:00

// When I need to store this in my database, I convert to UTC
const dbTime = userTime.toDatabase();

// Example of storing it to a database
db.query('update subscriptions set start_date=:date where user_id=:id', {
  date: dbTime.getZeit().toISO(), // 2024-03-01T15:00:00.000Z
  id: 1
});
```

##### Later, when I need to work with the subscription start date ...

```typescript
// Example of fetching the subscription from a database
const subscription = db.query('select * from subscriptions where user_id=:id', {id: 1});
const utcStartDate = subscription.start_date;

// My user's timezone
const userZone = Timezone.America.New_York;

// I create a Zeit instance for the user's timezone again
const zeit = Zeit.withUserZone(userZone);

// I create a DatabaseZeit instance from the stored UTC time
const storedDbTime = zeit.fromDatabase(utcStartDate);

// And easily convert it back to the user's local time for display
const userLocalStartDate = storedDbTime.toUser(); // 2024-03-01T10:00:00.000-05:00
```

This workflow has been a game-changer for me. It lets me:
1. Create a Zeit instance for each user's specific timezone
2. Work with user-friendly local times
3. Seamlessly convert to UTC for database storage
4. Easily retrieve and convert stored times back to user-friendly formats

By keeping user time and database time separate, I always know which timezone context I'm working in. Whether I'm handling user input, storing data, or displaying subscription information back to the user, Zeit keeps everything clear and consistent.

You're right, I apologize for the confusion. Let's correct the examples to use the actual methods available in the Zeit library. After reviewing the codebase, I see that we use the `cycles` method to handle subscription periods. Here's how we can update the "Handling Subscription Cycles" section:

## Handling Subscription Cycles

One of the trickiest parts of managing subscriptions is dealing with billing cycles, especially when users are spread across different timezones. Zeit has been a lifesaver for me in this regard. Here are a few examples of how I use it:

You're absolutely right. We should highlight this important feature of Zeit. Let's update the Monthly Subscriptions section to emphasize how Zeit automatically adjusts the billing day when necessary:

### Monthly Subscriptions

Let's say I have a user who starts a monthly subscription on January 30th:

```typescript
const userZone = Timezone.America.New_York;
const zeit = Zeit.withUserZone(userZone);

const subscriptionStart = zeit.fromUser("2024-01-30T10:00:00");
console.log("Subscription start:", subscriptionStart.getZeit().toISO());
// Output: 2024-01-30T10:00:00.000-05:00

// Generate the next 3 billing cycles
const cycles = subscriptionStart.cycles(3, { interval: "MONTHLY" });
const periods = cycles.getPeriods();

console.log("Next billing date:", periods[1].startsAt.getZeit().toISO());
// Output: 2024-02-29T10:00:00.000-05:00

console.log("Following billing date:", periods[2].startsAt.getZeit().toISO());
// Output: 2024-03-30T10:00:00.000-04:00

// Store the next billing date in UTC
db.query('update subscriptions set next_billing=:date where id=:id', {
  date: periods[1].startsAt.toDatabase().getZeit().toISO(),
  id: 1
});
```

Notice how Zeit handles the varying number of days in each month:

1. The subscription starts on January 30th.
2. The next billing date is automatically set to February 29th (2024 is a leap year).
3. The following billing date is March 30th.

Zeit adjusts the billing day automatically when necessary, ensuring that subscriptions always renew on the closest possible date to the original start date. This is especially useful for subscriptions that start near the end of the month, preventing any unexpected shifts in billing cycles.

### Handling Daylight Saving Time

Zeit takes care of daylight saving time transitions for me. Notice how the March billing date automatically adjusts for DST:

```typescript
const subscriptionStart = zeit.fromUser("2024-01-30T10:00:00");
console.log("Subscription start:", subscriptionStart.getZeit().toISO());
// Output: 2024-01-30T10:00:00.000-05:00

// Calculate billing dates including DST change
const cycles = subscriptionStart.cycles(3, { interval: "MONTHLY" });
const periods = cycles.getPeriods();

console.log("Billing after DST:", periods[2].startsAt.getZeit().toISO());
// Output: 2024-03-30T10:00:00.000-04:00
```

Notice how the timezone offset changed from -05:00 to -04:00, but the local time remained the same. This ensures that my users always get billed at the same local time, regardless of DST changes.

### Annual Subscriptions

For annual subscriptions, Zeit helps me handle leap years:

```typescript
const annualStart = zeit.fromUser("2024-01-30T15:00:00");
console.log("Annual subscription start:", annualStart.getZeit().toISO());
// Output: 2024-01-30T15:00:00.000-05:00

// Generate the next 2 annual cycles
const annualCycles = annualStart.cycles(2, { interval: "YEARLY" });
const annualPeriods = annualCycles.getPeriods();

console.log("Renewal date:", annualPeriods[1].startsAt.getZeit().toISO());
// Output: 2025-01-30T15:00:00.000-05:00

// Let's see what happens if we start on Feb 29 of a leap year
const leapYearStart = zeit.fromUser("2024-02-29T15:00:00");
const leapYearCycles = leapYearStart.cycles(2, { interval: "YEARLY" });
const leapYearPeriods = leapYearCycles.getPeriods();

console.log("Leap year renewal:", leapYearPeriods[1].startsAt.getZeit().toISO());
// Output: 2025-02-28T15:00:00.000-05:00
```

Zeit automatically adjusts for leap years, ensuring my renewal dates always make sense. When a subscription starts on a leap day (February 29th), it renews on February 28th in non-leap years.

---

## Conclusion

Zeit simplifies the complex task of managing datetimes across different timezones in your application. By providing a clear separation between user time and database time, and offering powerful tools for timezone-aware calculations, Zeit helps you build more robust and user-friendly time-based features in your applications.

---

### Who is DNL?

DNL, short for 'Dots and Lines', is a venture created by Tino Ehrich, a seasoned digital carpenter with over 20 years of experience in crafting projects and assisting businesses. DNL will specifically focus on developing projects that aim to simplify the access of information, and to develop these in the open.

---

### License

Zeit.ts is free software, and is released under the terms of the [Mozilla Public License](https://www.mozilla.org/en-US/MPL/) version 2.0. See [LICENSE](LICENSE).
