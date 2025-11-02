import { Router } from "express";
import { AssistantService } from "./assistant.service";
import { AssistantController } from "./assistant.controller";

export class AssistantRoutes {
    private readonly router = Router();

    public getRoutes(): Router {
        const assistantService = new AssistantService();
        const assistantController = new AssistantController(assistantService);

        this.router.post(
            "/assistant-trigger",
            assistantController.assistantTrigger
        );
        return this.router;
    }
}
