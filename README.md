# billing-cycles

![npm](https://img.shields.io/npm/v/billing-cycles)

JS package for determining billing cycles. Used for handling date math to calculate past & future billing dates.

Supports increments of monthly, quarterly and yearly billing.

### Installation
```shell
npm install billing-cycles
```

## Examples

#### Monthly Billing
```typescript
import {BillingCycle} from "./billing_cycle";
let now: Date;

const bc = new BillingCycle(
    new Date("2022-01-31"), // The billing anchor - First billing date
    1, "month" // How long a billing cycle is. 1 month is the default
);

now = new Date("2023-01-20");
bc.nextDueAt(now); // -> Date("2023-01-31")
bc.prevDueAt(now); // -> Date("2023-12-31")

// Gracefully handles cycles on days that don't exist in other months
now = new Date("2023-03-04")
bc.nextDueAt(now); // -> Date("2023-03-30")
bc.prevDueAt(now); // -> Date("2023-02-28")

// Gracefully handles "next billing date" when the first billing hasn't happened
now = new Date("2020-01-04")
bc.nextDueAt(now); // -> Date("2022-01-31")
bc.prevDueAt(now); // -> undefined
```

#### Quarterly Billing
```typescript
import {BillingCycle} from "./billing_cycle";
let now: Date;

const bc = new BillingCycle(
    new Date("2022-01-01"), // The billing anchor - First billing date
    1, "quarter" // How long a billing cycle is
);

now = new Date("2023-04-20");
bc.nextDueAt(now); // -> Date("2023-07-01")
bc.prevDueAt(now); // -> Date("2023-04-01")
```

#### Yearly Billing
```typescript
import {BillingCycle} from "./billing_cycle";
let now: Date;

const bc = new BillingCycle(
    new Date("2020-02-29"), // Leap year billing anchor!
    1, "years" // How long a billing cycle is
);

now = new Date("2022-04-20");
bc.nextDueAt(now); // -> Date("2023-02-28")
bc.prevDueAt(now); // -> Date("2022-02-28")

now = new Date("2023-11-26");
bc.nextDueAt(now); // -> Date("2024-02-29")
bc.prevDueAt(now); // -> Date("2023-02-28")
```

## Additional features

#### Elapsed time
```typescript
import {BillingCycle} from "./billing_cycle";
let now: Date;

const bc = new BillingCycle(
    new Date("2020-02-29"),
    1, "years"
);

now = new Date("2023-04-09");
bc.timeElapsed(now); // -> 3456000000 - Seconds elapsed into the period
bc.percentElapsed(now).toFixed(0); // 11 - Percentage elapsed in this period 
```

#### Remaining time
```typescript
import {BillingCycle} from "./billing_cycle";
let now: Date;

const bc = new BillingCycle(
    new Date("2020-02-29"),
    1, "years" 
);

now = new Date("2023-04-09");
bc.timeRemaining(now); // -> 28166400000 - Seconds left in the period
bc.percentRemaining(now).toFixed(0); // 89 - Percentage left in this period 
```

#### Number of billing cycles since creation
```typescript
import {BillingCycle} from "./billing_cycle";
let now: Date;

const bc = new BillingCycle(
    new Date("2020-02-29"),
);

now = new Date("2023-04-09");
bc.numberOfCyclesSinceCreated(now); // -> 37

now = new Date("1999-01-12");
bc.numberOfCyclesSinceCreated(now); // -> 0
```

#### Get N prev/next cycles
```typescript
import {BillingCycle} from "./billing_cycle";
let now: Date;

const bc = new BillingCycle(
    new Date("2022-11-04")
);

now = new Date("2023-02-09");
bc.prevNDueDates(5, now) // -> Date(2023-02-04),
                         //    Date(2023-01-04),
                         //    Date(2022-12-04),
                         //    Date(2022-11-04),
                         // [only returned 4, because the 5th would be before the billing anchor]

bc.nextNDueDates(5, now); // ->  Date(2023-03-04),
                          //     Date(2023-04-04),
                          //     Date(2023-05-04),
                          //     Date(2023-06-04),
                          //     Date(2023-07-04)
```