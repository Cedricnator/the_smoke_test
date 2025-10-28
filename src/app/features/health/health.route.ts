import { Router } from "express";
import { HealthService } from "./health.service";
import { HealthController } from "./health.controller";

export class HealthRoutes {
  private readonly router = Router();

  public getRoutes(): Router {
    const healthService = new HealthService();
    const healthController = new HealthController(healthService);

    this.router.get("/health", healthController.getHealthStatus);
    return this.router;
  }
}