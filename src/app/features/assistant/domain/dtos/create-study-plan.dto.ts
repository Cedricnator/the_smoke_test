import { Restrictions } from "../models/restrictions.model";

export class CreateStudyPlanDto {
  private constructor(
    public readonly topics: string[],
    public readonly weeks: number,
    public readonly weeklyDedication: number,
    public readonly startDate?: string,
    public readonly restrictions?: Restrictions
  ) {}

  static create(object: Record<string, any>): [string | undefined, CreateStudyPlanDto | undefined] {
    const { topics, weeks, weeklyDedication, startDate, restrictions } = object;
    if (!Array.isArray(topics)) {
      return ["Invalid topics", undefined];
    }

    if (typeof weeks !== "number" || weeks <= 0) {
      return ["Weeks must be a positive number", undefined];
    }

    if (typeof weeklyDedication !== "number" || weeklyDedication <= 0) {
      return ["Weekly dedication must be a positive number", undefined];
    }

    if (startDate && isNaN(Date.parse(startDate))) {
      return ["Invalid start date", undefined];
    }

    return [
      undefined,
      new CreateStudyPlanDto(
        topics,
        weeks,
        weeklyDedication,
        startDate,
        restrictions
      ),
    ];
  }
}
