import { Restrictions } from "./restrictions.model";

interface OptionsConstructor {
  topics: string[];
  weeks: number;
  weeklyDedication: number; // in hours
  startDate?: string; // ISO date string
  restrictions?: Restrictions;
}

export class StudyPlan {
  private readonly topics: string[];
  private readonly weeks: number;
  private readonly weeklyDedication: number;
  private readonly startDate?: string
  private readonly restrictions?: Restrictions;

  private constructor(options: OptionsConstructor){
    this.topics = options.topics;
    this.weeks = options.weeks;
    this.weeklyDedication = options.weeklyDedication;
    this.startDate = options.startDate;
    this.restrictions = options.restrictions;
  }

  static create(options: OptionsConstructor): StudyPlan {
    if (options.weeks <= 0) {
      throw new Error("Weeks must be greater than 0");
    }

    if (options.weeklyDedication <= 0) {
      throw new Error("Weekly dedication must be greater than 0");
    }

    if (options.topics.length === 0) {
      throw new Error("At least one topic must be provided");
    }
    return new StudyPlan(options);
  }

  getTopics(): string[] {
    return this.topics;
  } 

  getWeeks(): number {
    return this.weeks;
  }

  getWeeklyDedication(): number {
    return this.weeklyDedication;
  }

  getStartDate(): string | undefined {
    return this.startDate;
  }

  getRestrictions(): Restrictions | undefined {
    return this.restrictions;
  }
}