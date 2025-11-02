import { WeekPlan } from "./week-plan.model";

export class Plan {
  constructor(
    public readonly weeks: WeekPlan[],
    public readonly metadata: {
      origin: "llm";
      generatedAt: string;
    },
  ){}
}