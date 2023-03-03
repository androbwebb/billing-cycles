import { BillingCycle } from "./billing_cycle";

describe("BillingCycle", () => {
  describe("numberOfCyclesSinceCreated", () => {
    it("correctly calculates number of monthly cycles since created", () => {
      const bc = new BillingCycle(new Date("2022-01-31"), 1, "months");
      expect(bc.numberOfCyclesSinceCreated(new Date("2023-01-31"))).toEqual(12);
      expect(bc.numberOfCyclesSinceCreated(new Date("2023-06-04"))).toEqual(16);
      expect(bc.numberOfCyclesSinceCreated(new Date("1990-01-31"))).toEqual(0);
      expect(bc.numberOfCyclesSinceCreated(new Date("2022-02-01"))).toEqual(0);
    });
    it("correctly calculates number of multi-monthly cycles since created", () => {
      const bc = new BillingCycle(new Date("2022-01-31"), 2, "months");
      expect(bc.numberOfCyclesSinceCreated(new Date("2023-01-31"))).toEqual(6);
      expect(bc.numberOfCyclesSinceCreated(new Date("2023-06-04"))).toEqual(8);
      expect(bc.numberOfCyclesSinceCreated(new Date("1990-01-31"))).toEqual(0);
      expect(bc.numberOfCyclesSinceCreated(new Date("2022-02-01"))).toEqual(0);
    });
    it("correctly calculates number of yearly cycles since created", () => {
      const bc = new BillingCycle(new Date("2022-01-31"), 1, "years");
      expect(bc.numberOfCyclesSinceCreated(new Date("2023-01-31"))).toEqual(1);
      expect(bc.numberOfCyclesSinceCreated(new Date("2023-06-04"))).toEqual(1);
      expect(bc.numberOfCyclesSinceCreated(new Date("1990-01-31"))).toEqual(0);
      expect(bc.numberOfCyclesSinceCreated(new Date("2022-12-01"))).toEqual(0);
    });
  });

  describe("nextDueAt", () => {
    it("correctly calculates next due at of monthly cycles", () => {
      const bc = new BillingCycle(new Date("2022-01-31"), 1, "months");
      expect(bc.nextDueAt(new Date("2023-01-31")).toISOString()).toEqual(
        "2023-01-31T00:00:00.000Z",
      );
      expect(bc.nextDueAt(new Date("2023-01-28")).toISOString()).toEqual(
        "2023-01-31T00:00:00.000Z",
      );
      expect(bc.nextDueAt(new Date("2023-02-01")).toISOString()).toEqual(
        "2023-02-28T00:00:00.000Z",
      );
      expect(bc.nextDueAt(new Date("1990-01-31")).toISOString()).toEqual(
        "2022-01-31T00:00:00.000Z",
      );
    });
    it("correctly calculates next due at of multi-monthly cycles", () => {
      const bc = new BillingCycle(new Date("2022-01-31"), 2, "months");
      expect(bc.nextDueAt(new Date("2023-01-31")).toISOString()).toEqual(
        "2023-01-31T00:00:00.000Z",
      );
      expect(bc.nextDueAt(new Date("2023-01-28")).toISOString()).toEqual(
        "2023-01-31T00:00:00.000Z",
      );
      expect(bc.nextDueAt(new Date("2023-02-01")).toISOString()).toEqual(
        "2023-03-31T00:00:00.000Z",
      );
      expect(bc.nextDueAt(new Date("1990-01-31")).toISOString()).toEqual(
        "2022-01-31T00:00:00.000Z",
      );
    });
    it("correctly calculates next due at of yearly cycles", () => {
      const bc = new BillingCycle(new Date("2022-01-31"), 1, "years");
      expect(bc.nextDueAt(new Date("2023-01-31")).toISOString()).toEqual(
        "2023-01-31T00:00:00.000Z",
      );
      expect(bc.nextDueAt(new Date("2023-01-28")).toISOString()).toEqual(
        "2023-01-31T00:00:00.000Z",
      );
      expect(bc.nextDueAt(new Date("2023-02-01")).toISOString()).toEqual(
        "2024-01-31T00:00:00.000Z",
      );
      expect(bc.nextDueAt(new Date("2024-02-01")).toISOString()).toEqual(
        "2025-01-31T00:00:00.000Z",
      );
      expect(bc.nextDueAt(new Date("1990-01-31")).toISOString()).toEqual(
        "2022-01-31T00:00:00.000Z",
      );
    });
  });

  describe("prevDueAt", () => {
    it("correctly calculates next due at of monthly cycles", () => {
      const bc = new BillingCycle(new Date("2022-01-31"), 1, "months");
      expect(bc.prevDueAt(new Date("2023-01-31"))?.toISOString()).toEqual(
        "2022-12-31T00:00:00.000Z",
      );
      expect(bc.prevDueAt(new Date("2023-01-28"))?.toISOString()).toEqual(
        "2022-12-31T00:00:00.000Z",
      );
      expect(bc.prevDueAt(new Date("2023-02-01"))?.toISOString()).toEqual(
        "2023-01-31T00:00:00.000Z",
      );
      expect(bc.prevDueAt(new Date("1990-01-31"))?.toISOString()).toEqual(
        undefined,
      );
    });
    it("correctly calculates next due at of multi-monthly cycles", () => {
      const bc = new BillingCycle(new Date("2022-01-31"), 2, "months");
      expect(bc.prevDueAt(new Date("2023-01-31"))?.toISOString()).toEqual(
        "2022-11-30T00:00:00.000Z",
      );
      expect(bc.prevDueAt(new Date("2023-01-28"))?.toISOString()).toEqual(
        "2022-11-30T00:00:00.000Z",
      );
      expect(bc.prevDueAt(new Date("2023-02-01"))?.toISOString()).toEqual(
        "2023-01-31T00:00:00.000Z",
      );
      expect(bc.prevDueAt(new Date("1990-01-31"))?.toISOString()).toEqual(
        undefined,
      );
    });
    it("correctly calculates next due at of yearly cycles", () => {
      const bc = new BillingCycle(new Date("2022-01-31"), 1, "years");
      expect(bc.prevDueAt(new Date("2023-01-31"))?.toISOString()).toEqual(
        "2022-01-31T00:00:00.000Z",
      );
      expect(bc.prevDueAt(new Date("2023-01-28"))?.toISOString()).toEqual(
        "2022-01-31T00:00:00.000Z",
      );
      expect(bc.prevDueAt(new Date("2023-02-01"))?.toISOString()).toEqual(
        "2023-01-31T00:00:00.000Z",
      );
      expect(bc.prevDueAt(new Date("2024-02-01"))?.toISOString()).toEqual(
        "2024-01-31T00:00:00.000Z",
      );
      expect(bc.prevDueAt(new Date("1990-01-31"))?.toISOString()).toEqual(
        undefined,
      );
    });
  });

  describe("nextNDueDates", () => {
    it("gives the next N dates", () => {
      const bc = new BillingCycle(new Date("2022-01-31"), 2, "months");
      expect(
        bc.nextNDueDates(5, new Date("2022-01-31")).map((d) => d.toISOString()),
      ).toEqual([
        "2022-01-31T00:00:00.000Z",
        "2022-03-31T00:00:00.000Z",
        "2022-05-31T00:00:00.000Z",
        "2022-07-31T00:00:00.000Z",
        "2022-09-30T00:00:00.000Z",
      ]);
    });
  });

  describe("prevNDueDates", () => {
    it("gives the previous N due dates", () => {
      const bc = new BillingCycle(new Date("2022-01-31"), 3, "months");
      expect(
        bc.prevNDueDates(4, new Date("2023-01-31")).map((d) => d.toISOString()),
      ).toEqual([
        "2022-10-31T00:00:00.000Z",
        "2022-07-31T00:00:00.000Z",
        "2022-04-30T00:00:00.000Z",
        "2022-01-31T00:00:00.000Z",
      ]);
    });

    it("does not give dates before the anchor point", () => {
      const bc = new BillingCycle(new Date("2022-7-31"), 3, "months");
      expect(
        bc.prevNDueDates(4, new Date("2023-01-31")).map((d) => d.toISOString()),
      ).toEqual(["2022-10-31T00:00:00.000Z", "2022-07-31T00:00:00.000Z"]);
    });

    it("gives an empty list if now is before the anchor point", () => {
      const bc = new BillingCycle(new Date("2022-7-31"), 3, "months");
      expect(
        bc.prevNDueDates(4, new Date("1999-01-31")).map((d) => d.toISOString()),
      ).toEqual([]);
    });
  });

  describe("secondsInCurrentCycle", () => {
    it("gives the number of seconds in a cycle", () => {
      const secondsInADay = 1000 * 60 * 60 * 24;
      // A short month (february)
      expect(
        new BillingCycle(
          new Date("2022-01-31"),
          1,
          "months",
        ).secondsInCurrentCycle(new Date("2022-02-20")),
      ).toEqual(secondsInADay * 28);

      // // A 31 day month (february)
      expect(
        new BillingCycle(
          new Date("2022-01-31"),
          1,
          "months",
        ).secondsInCurrentCycle(new Date("2023-01-20")),
      ).toEqual(secondsInADay * 31);

      // A multi-month cycle
      expect(
        new BillingCycle(
          new Date("2022-01-31"),
          3,
          "months",
        ).secondsInCurrentCycle(new Date("2023-01-20")),
      ).toEqual(secondsInADay * (30 + 31 + 31)); // 30: Nov, 31: Dec, 31: Jan

      // A year cycle
      expect(
        new BillingCycle(
          new Date("2022-01-31"),
          1,
          "years",
        ).secondsInCurrentCycle(new Date("2023-01-20")),
      ).toEqual(secondsInADay * 365);
    });
  });

  describe("percentElapsed/percentRemaining", () => {
    it("gives the correct percentage", () => {
      const bc = new BillingCycle(new Date("2022-01-31"), 1, "months");
      expect(bc.percentElapsed(new Date("2022-02-20")).toFixed(1)).toEqual(
        "71.4",
      );
      expect(bc.percentRemaining(new Date("2022-02-20")).toFixed(1)).toEqual(
        "28.6",
      );

      expect(bc.percentElapsed(new Date("2023-01-31")).toFixed(1)).toEqual(
        "100.0",
      );
      expect(bc.percentRemaining(new Date("2023-01-31")).toFixed(1)).toEqual(
        "0.0",
      );

      expect(bc.percentElapsed(new Date("2023-02-01")).toFixed(1)).toEqual(
        "3.6",
      );
      expect(bc.percentRemaining(new Date("2023-02-01")).toFixed(1)).toEqual(
        "96.4",
      );
    });
  });

  describe("timeElapsed/timeRemaining", () => {
    it("gives the correct duration", () => {
      const bc = new BillingCycle(new Date("2022-01-31"), 1, "months");
      const secondsInADay = 1000 * 60 * 60 * 24;
      expect(bc.timeElapsed(new Date("2022-02-20"))).toEqual(
        secondsInADay * 20,
      );
      expect(bc.timeRemaining(new Date("2022-02-20"))).toEqual(
        secondsInADay * 8,
      );

      expect(bc.timeElapsed(new Date("2023-01-31"))).toEqual(
        secondsInADay * 31,
      );
      expect(bc.timeRemaining(new Date("2023-01-31"))).toEqual(0);

      expect(bc.timeElapsed(new Date("2023-02-01"))).toEqual(secondsInADay * 1);
      expect(bc.timeRemaining(new Date("2023-02-01"))).toEqual(
        secondsInADay * 27,
      );
    });
  });
});
