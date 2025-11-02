import { Router } from "express";
import { HealthRoutes } from "./features/health/health.route";
import { AssistantRoutes } from "./features/assistant/assistant.route";

export class Routes {
    private readonly router = Router();

    getRoutes(): Router {
        const healthRoutes = new HealthRoutes();
        this.router.use(healthRoutes.getRoutes());

        const assistantRoutes = new AssistantRoutes();
        this.router.use(assistantRoutes.getRoutes());

        return this.router;
    }
}