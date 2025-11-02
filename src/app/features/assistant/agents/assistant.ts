import OpenAI from "openai";
import { env } from "@/app/config/env";
import { PlanningRequestDto } from "../dto/planning-request.dto";
import { PlanningResponseDto } from "../dto/planning-response.dto";
import { Logger } from "@/app/adapters/logger.adapter";
import { createLogger } from "@/app/config/logger";

export class Assistant {
    private openRouterClient?: OpenAI;
    private model: string;
    private logger: Logger;
    constructor() {
        this.model = "google/gemma-3-27b-it:free";
        this.logger = createLogger('Assistant');
        if (env.OPENROUTER_API_KEY) {
            this.openRouterClient = new OpenAI({
                apiKey: env.OPENROUTER_API_KEY,
                baseURL: "https://openrouter.ai/api/v1",
            });
        }
    }

    async triggerAssistant(
        request: PlanningRequestDto
    ): Promise<PlanningResponseDto> {
        const startingTime = Date.now();

        // Create a detailed prompt from the planning request
        const prompt = this.buildPrompt(request);

        this.logger.info(`Triggering assistant`);

        if (!this.openRouterClient) {
            // Mock response if no API key
            return { response: `Mock response to planning request: ${prompt}` };
        }

        // Use OpenRouter to generate a response
        const completion = await this.openRouterClient.chat.completions.create({
            model: this.model,
            messages: [{ role: "user", content: prompt }],
        });

        this.logger.info(`Received response from OpenRouter in ${Date.now() - startingTime} ms`);

        const response =
            completion.choices[0]?.message?.content || "No response";

        

        const planningResponse = {
            response,
        }

        return planningResponse;
    }

    buildPrompt(request: PlanningRequestDto): string {
        return `Por favor actúa como un asistente de planificación de aprendizaje experto. Ayuda a crear un plan de aprendizaje detallado basado en los siguientes parámetros:

        Temas para aprender: ${request.topics.join(", ")}
        Duración total: ${request.totalWeeks} semanas
        Compromiso de tiempo: ${request.dedicatedTotalTimePerWeek} horas por semana
        Fecha de inicio: ${request.startingDate}

        Proporcione un plan por semana con objetivos claros, actividades y estimaciones.
        Asegúrate de cubrir todos los temas mencionados y adapta el plan al tiempo disponible semanalmente.
        `
    }
}
