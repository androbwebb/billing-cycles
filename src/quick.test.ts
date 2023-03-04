import {BillingCycle} from "./billing_cycle";

describe("test", () => {
    it("test", () => {
        let now: Date;


        const bc = new BillingCycle(
            new Date("2022-11-04")
        );

        now = new Date("2023-02-09");
        console.log('A::::', bc.nextNDueDates(5, now))
    })
})