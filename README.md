# Zeit ⏰ 

Because somewhere in the world, it's already tomorrow, and your code needs to deal with it.

Zeit is a TypeScript library that makes datetime handling less painful, especially when your users are scattered across timezones like stars in the sky. Perfect for:
- Subscription services (because money doesn't care what time it is)
- Billing systems (your 3 PM invoice shouldn't arrive at 3 AM)
- Any app where timing is everything (and timezones are trying to ruin everything)

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

## Handling Subscription Cycles

One of the trickiest parts of managing subscriptions is dealing with billing cycles, especially when users are spread across different timezones. Zeit has been a lifesaver for me in this regard. Here are a few examples of how I use it:

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

### Custom Cycle Intervals

Zeit isn't limited to just monthly billing cycles. You can specify different intervals based on your needs:

```typescript
// Weekly subscriptions for the overachievers
const weeklyStart = zeit.fromUser("2024-01-01T08:00:00");
const weeklyCycles = weeklyStart.cycles(4, { interval: "WEEKLY" });

console.log("Next week's billing:", weeklyCycles.getPeriods()[1].startsAt.getZeit().toISO());
// Output: 2024-01-08T08:00:00.000-05:00

// Daily intervals, because some businesses actually need this
const dailyStart = zeit.fromUser("2024-01-30T23:59:00");
const dailyCycles = dailyStart.cycles(3, { interval: "DAILY" });

console.log("Tomorrow's cycle:", dailyCycles.getPeriods()[1].startsAt.getZeit().toISO());
// Output: 2024-01-31T23:59:00.000-05:00

// Quarterly billing - for the more patient subscription models
const quarterlyStart = zeit.fromUser("2024-01-15T12:00:00");
const quarterlyCycles = quarterlyStart.cycles(2, { interval: "QUARTERLY" });

console.log("Next quarter billing:", quarterlyCycles.getPeriods()[1].startsAt.getZeit().toISO());
// Output: 2024-04-15T12:00:00.000-04:00 (with DST adjustment, naturally)
```

### Working with Periods

Zeit provides powerful tools for working with the billing periods:

```typescript
const subscriptionStart = zeit.fromUser("2024-02-29T14:30:00"); // Starting on a leap day
const cycles = subscriptionStart.cycles(3, { interval: "MONTHLY" });
const periods = cycles.getPeriods();

// Checking if a specific date falls within a billing period
const randomDate = zeit.fromUser("2024-03-15T10:00:00");
const isInPeriod = periods[1].contains(randomDate);
console.log("Is date within billing period:", isInPeriod);
// Output: true

// How long until the next billing cycle?
const now = zeit.fromUser("2024-03-15T10:00:00");
const nextBillingIn = periods[2].startsAt.getZeit().diff(now.getZeit(), ["days", "hours"]).toObject();
console.log("Time until next billing cycle:", nextBillingIn);
// Output: { days: 14, hours: 4.5 }

// Duration of the billing period (useful for proration)
const periodDuration = periods[1].getDuration("days");
console.log("Days in this billing period:", periodDuration);
// Output: 30 (or 31, or 28... depending on the month)
```

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

### Timezone Manipulation

Sometimes users move or you need to adjust their timezone:

```typescript
// When your US customer moves to Europe
const originalZone = Timezone.America.New_York;
const newZone = Timezone.Europe.Berlin;

const originalSubscription = Zeit.withUserZone(originalZone).fromUser("2024-01-01T20:00:00");
console.log("Original billing time (NYC):", originalSubscription.getZeit().toISO());
// Output: 2024-01-01T20:00:00.000-05:00

// Converting to the new timezone while preserving the absolute time
const newZeitInstance = Zeit.withUserZone(newZone);
const convertedTime = newZeitInstance.fromDatabase(originalSubscription.toDatabase().getZeit().toISO());
console.log("Same moment in Berlin:", convertedTime.getZeit().toISO());
// Output: 2024-01-02T02:00:00.000+01:00

// Adjusting to a more reasonable hour in their new timezone
const adjustedTime = newZeitInstance.fromUser(
  convertedTime.getZeit().set({ hour: 20, minute: 0, second: 0 }).toISO()
);
console.log("New adjusted billing time:", adjustedTime.getZeit().toISO());
// Output: 2024-01-02T20:00:00.000+01:00
```

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

### Date Calculations

Zeit makes common date calculations easy while preserving timezone context:

```typescript
const userZone = Timezone.Australia.Sydney;
const zeit = Zeit.withUserZone(userZone);
const startDate = zeit.fromUser("2024-01-15T09:00:00");

// Adding specific amounts of time
const extendedDate = startDate.clone().add({ hours: 36, minutes: 15 });
console.log("Extended date:", extendedDate.getZeit().toISO());
// Output: 2024-01-16T21:15:00.000+11:00

// Calculating business days (weekends excluded)
const businessDeliveryDate = startDate.clone().addBusinessDays(5);
console.log("Business days delivery date:", businessDeliveryDate.getZeit().toISO());
// Output: 2024-01-22T09:00:00.000+11:00

// Finding the last day of the month
const lastDayOfMonth = startDate.clone().endOfMonth();
console.log("Last day of month:", lastDayOfMonth.getZeit().toISO());
// Output: 2024-01-31T23:59:59.999+11:00
```

### Error Handling

Zeit helps you handle common date-related errors gracefully:

```typescript
// Handling invalid dates
try {
  // Will throw an error because February 30th doesn't exist
  const nonExistentDate = zeit.fromUser("2024-02-30T12:00:00");
} catch (error) {
  console.error("Invalid date:", error.message);
  
  // Gracefully handle by finding the last valid day of February
  const lastDayOfFeb = zeit.fromUser("2024-02-01T12:00:00").endOfMonth();
  console.log("Last actual day in February:", lastDayOfFeb.getZeit().toFormat("yyyy-MM-dd"));
  // Output: 2024-02-29 (at least in 2024)
}

// Validating future dates
const futureDate = zeit.fromUser("2077-01-01T00:00:00");
  
// Optional validation
if (futureDate.getZeit() > DateTime.now()) {
  console.log("Future date detected, using current time instead");
  const fallbackDate = zeit.now();
  console.log("Using current time:", fallbackDate.getZeit().toISO());
}
```

### Real-World Scenario: Creating a Monthly Billing Service

```typescript
// Create a billing service that respects user timezones
function scheduleNextBilling(userId, userTimezone, currentBillingDate) {
  // Create Zeit instance for this user
  const userZeit = Zeit.withUserZone(userTimezone);
  
  // Convert the current billing date to a Zeit object
  const billingZeit = userZeit.fromDatabase(currentBillingDate);
  
  // Generate the next billing cycle
  const nextCycle = billingZeit.cycles(1, { interval: "MONTHLY" }).getPeriods()[1];
  
  // Store next billing date in UTC (database time)
  const nextBillingDateUTC = nextCycle.startsAt.toDatabase().getZeit().toISO();
  
  console.log("Next billing for user:", userId);
  console.log("In user's timezone:", nextCycle.startsAt.getZeit().toFormat("yyyy-MM-dd HH:mm"));
  console.log("In database (UTC):", nextBillingDateUTC);
  
  return nextBillingDateUTC;
}

// Example usage:
const nextBilling = scheduleNextBilling(
  "user_42",
  Timezone.Asia.Tokyo,
  "2024-01-31T15:00:00Z"
);
// Output: Next billing in user's timezone: 2024-02-29 00:00
```

---

## Conclusion

Zeit simplifies the complex task of managing datetimes across different timezones in your application. By providing a clear separation between user time and database time, and offering powerful tools for timezone-aware calculations, Zeit helps you build more robust and user-friendly time-based features in your applications.

Remember, Zeit doesn't just handle time—it handles time so you don't have to. Because let's face it, you'd rather be building features than debugging why your European customers are getting billed at 3 AM.

---

### Who is DNL?

DNL, short for 'Dots and Lines', is a venture created by Tino Ehrich, a seasoned digital carpenter with over 20 years of experience in crafting projects and assisting businesses. DNL will specifically focus on developing projects that aim to simplify the access of information, and to develop these in the open.

---

### Credits

Zeit relies on [Luxon](https://moment.github.io/luxon/), a powerful library for working with dates and times in JavaScript. We particularly leverage Luxon's robust timezone processing capabilities, which form the backbone of Zeit's timezone-aware operations.

Also thanks to all the contributors of [luxon's type definitions](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/luxon).

Pretty helpful stuff.

---

### License

Zeit.ts is free software, and is released under the terms of the [Mozilla Public License](https://www.mozilla.org/en-US/MPL/) version 2.0. See [LICENSE](LICENSE).
