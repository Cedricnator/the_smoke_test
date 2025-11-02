import { Logger } from "@/app/adapters/logger.adapter";
import { createLogger } from "@/app/config/logger";
import { PlanningRequestDto } from "./dto/planning-request.dto";
import { PlanningResponseDto } from "./dto/planning-response.dto";
import { Assistant } from "./agents/assistant";

export class AssistantService {
    private readonly logger: Logger;
    private readonly assistant: Assistant;

    constructor() {
        this.logger = createLogger("assistant-service");
        this.assistant = new Assistant();
    }

    public async triggerAssistant(
        request: PlanningRequestDto
    ): Promise<PlanningResponseDto> {
        const response: PlanningResponseDto =
            await this.assistant.triggerAssistant(request);

        return response;
    }
}
