import { Router } from "express";
import { AssistantService } from "./assistant.service";
import { AssistantController } from "./assistant.controller";
import { createLogger } from "@/app/config/logger";

export class AssistantRoutes {
  private readonly router: Router;

  constructor() {
    this.router = Router();
  }

  getRoutes(): Router {
    const logger = createLogger("assistant");
    const assistantService = new AssistantService(logger);
    const assistantController = new AssistantController(assistantService);

    this.router.post(
      "/study-plan",
      assistantController.createStudyPlan,
    );

    return this.router;
  }
}
