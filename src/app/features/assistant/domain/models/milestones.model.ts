interface OptionsConstructor {
  week: number;
  description: string;
}

export class Milestones {
  private readonly week?: number;
  private readonly description?: string;

  constructor(opts: OptionsConstructor) {
    this.week = opts.week;
    this.description = opts.description;
  }

  getWeek(): number | undefined {
    return this.week;
  }

  getDescription(): string | undefined {
    return this.description;
  }
}