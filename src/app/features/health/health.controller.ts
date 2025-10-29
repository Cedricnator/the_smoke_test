import { Request, Response } from "express";
import { HealthService } from "./health.service";

export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  public getHealthStatus = (req: Request, res: Response) => {
    const status = this.healthService.getStatus();
    res.status(200).json(status);
  }
}