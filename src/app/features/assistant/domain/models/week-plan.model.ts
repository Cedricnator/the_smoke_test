export class WeekPlan {
  constructor(
    public readonly weekNumber: number,
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly topics: string[],
    public readonly activities: string[],
    public readonly estimatedHours: number,
    public readonly milestone?: string,
  ){}
}