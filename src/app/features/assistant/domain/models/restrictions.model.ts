import { Milestones } from "./milestones.model";

interface OptionsConstructor {
  holidays?: string[]; // ISO date strings
  blockedWeeks?: number[]; // week numbers to skip
  milestones?: Milestones[];
}

export class Restrictions {
  private readonly holidays?: string[];
  private readonly blockedWeeks?: number[];
  private readonly milestones?: Milestones[];
  
  constructor(options: OptionsConstructor) {
    this.holidays = options.holidays;
    this.blockedWeeks = options.blockedWeeks;
    this.milestones = options.milestones;
  }

  getHolidays(): string[] | undefined {
    return this.holidays;
  }

  getBlockedWeeks(): number[] | undefined {
    return this.blockedWeeks;
  }

  getMilestones(): Milestones[] | undefined {
    return this.milestones;
  }
}