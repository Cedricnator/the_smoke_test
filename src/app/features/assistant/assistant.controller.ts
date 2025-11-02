import e, { Request, Response } from "express";
import { AssistantService } from "./assistant.service";
import { Logger } from "@/app/adapters/logger.adapter";
import { createLogger } from "@/app/config/logger";
import {
    PlanningRequestDto,
    planningRequestSchema,
} from "./dto/planning-request.dto";
import { PlanningResponseDto } from "./dto/planning-response.dto";

export class AssistantController {
    private readonly logger: Logger;

    constructor(private readonly assistantService: AssistantService) {
        this.logger = createLogger("assistant-controller");
    }

    public assistantTrigger = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            this.logger.info("Received assistant trigger request", {
                body: req.body,
            });

            // Validate and parse request
            const request = planningRequestSchema.parse(req.body);

            // Gets response
            const response: PlanningResponseDto =
                await this.assistantService.triggerAssistant(request);

            // Sends response
            res.status(200).json(response);
        } catch (error) {
            this.logger.error("Error occurred while triggering assistant", {
                error:
                    error instanceof Error
                        ? error.message
                        : "Internal server error",
            });
            res.status(500).json({
                error:
                    error instanceof Error
                        ? error.message
                        : "Internal server error",
            });
        }
    };
}
