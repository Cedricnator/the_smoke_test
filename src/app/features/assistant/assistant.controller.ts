import { Request, Response } from "express";
import { AssistantService } from "./assistant.service";
import { CreateStudyPlanDto } from "./domain/dtos/create-study-plan.dto";

export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  public createStudyPlan = async (req: Request, res: Response) => {
    const body = req.body;
    const [error, studyPlanDto] = CreateStudyPlanDto.create(body);
    if (error) return res.status(400).json({ error });
    return this.assistantService.generateStudyPlan(studyPlanDto!)
      .then((result) => res.json(result))
      .catch((error) => {
        res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
      });
  }
}
