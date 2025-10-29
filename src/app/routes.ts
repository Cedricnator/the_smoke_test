import { Router } from "express";
import { HealthRoutes } from "./features/health/health.route";

export class Routes {
  private readonly router = Router();

  getRoutes(): Router {
    const healthRoutes = new HealthRoutes();
    this.router.use(healthRoutes.getRoutes());
    return this.router;
  }
}