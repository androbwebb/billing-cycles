import { add, intervalToDuration, yearsToMonths } from "date-fns";

type DurationUnit = "years" | "months";

export class BillingCycle {
  anchor: Date;
  intervalValue: number;
  unit: DurationUnit;

  constructor(
    anchor: Date,
    intervalValue: number,
    intervalUnit: DurationUnit = "months",
  ) {
    this.anchor = anchor;
    this.intervalValue = intervalValue;
    this.unit = intervalUnit;
  }

  /**
   * Returns the next billing date based on the subscription
   * @param now The current time
   * @return Date The next billing date/time
   */
  nextDueAt(now?: Date) {
    now = now ?? new Date();

    // The next billing date is always the original date if "now" is earlier than the original date
    if (now <= this.anchor) {
      return this.anchor;
    }

    let numberOfCycles = this.numberOfCyclesSinceCreated(now);
    let nextDueAt = this.calculateDueAt(numberOfCycles);

    while (nextDueAt < now) {
      numberOfCycles += 1;
      nextDueAt = this.calculateDueAt(numberOfCycles);
    }

    return nextDueAt;
  }

  prevDueAt(now?: Date): Date | undefined {
    now = now ?? new Date();

    if (now < this.anchor) {
      return;
    }

    let numberOfCycles = this.cycleCountDifference(now) + 2;
    let prevDueAt = this.calculateDueAt(numberOfCycles);

    while (prevDueAt >= now) {
      numberOfCycles -= 1;
      prevDueAt = this.calculateDueAt(numberOfCycles);
    }

    return prevDueAt;
  }

  nextNDueDates(n: number, now?: Date) {
    now = now ?? new Date();

    const result = [this.nextDueAt(now)];

    for (let i = 1; i < n; i++) {
      const prev = result[i - 1];
      result.push(this.nextDueAt(new Date(prev.getTime() + 1)));
    }

    return result;
  }

  prevNDueDates(n: number, now?: Date): Date[] {
    now = now ?? new Date();

    const first = this.prevDueAt(now);
    if (!first) {
      return [];
    }

    const result = [first];

    for (let i = 1; i < n; i++) {
      const prev = result[i - 1];
      const nextPrev = this.prevDueAt(new Date(prev.getTime() - 1));
      if (nextPrev === undefined || prev.getTime() === nextPrev.getTime()) {
        break;
      }
      result.push(nextPrev);
    }

    return result;
  }

  numberOfCyclesSinceCreated(now?: Date) {
    return Math.max(0, this.cycleCountDifference(now));
  }

  private cycleCountDifference(now?: Date) {
    now = now ?? new Date();

    const multiplier = now < this.anchor ? -1 : 1;

    const duration = intervalToDuration({
      start: this.anchor,
      end: now,
    });

    let answer = 0;
    switch (this.unit) {
      case "months":
        answer = Math.floor(
          (yearsToMonths(duration.years || 0) + (duration.months || 0)) /
            this.intervalValue,
        );
        break;
      case "years":
        answer = Math.floor((duration.years || 0) / this.intervalValue);
        break;
    }

    return answer * multiplier;
  }

  calculateDueAt(numberOfCycles: number) {
    return add(this.anchor, {
      [this.unit]: numberOfCycles * this.intervalValue,
    });
  }

  percentElapsed(now?: Date) {
    now = now ?? new Date();
    return 100 * (this.timeElapsed(now) / this.secondsInCurrentCycle(now));
  }

  percentRemaining(now?: Date) {
    now = now ?? new Date();
    return 100 * (this.timeRemaining(now) / this.secondsInCurrentCycle(now));
  }

  timeRemaining(now?: Date) {
    now = now ?? new Date();
    return this.nextDueAt(now).getTime() - now.getTime();
  }

  timeElapsed(now?: Date) {
    now = now ?? new Date();
    const prev = this.prevDueAt(now);
    if (!prev) {
      return -1;
    }
    return now.getTime() - prev.getTime();
  }

  secondsInCurrentCycle(now?: Date) {
    now = now ?? new Date();
    const prev = this.prevDueAt(now);
    if (!prev) {
      return -1;
    }
    return this.nextDueAt(now).getTime() - prev.getTime();
  }
}
