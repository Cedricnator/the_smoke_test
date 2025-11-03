import { Logger } from "@/app/adapters/logger.adapter";
import OpenAI from "openai";
import { CreateStudyPlanDto } from "./domain/dtos/create-study-plan.dto";
import { Plan } from "./domain/models/plan.model";

export class AssistantService {
    private openaiClient: OpenAI;

    constructor(private readonly logger: Logger) {
        this.openaiClient = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY || "",
        });
    }

    async generateStudyPlan(params: CreateStudyPlanDto) {
        this.logger.info("Generating study plan with OpenRouter model...");
        const modelName = "tngtech/deepseek-r1t-chimera:free";
        const topics = params.topics.map((t) => `- ${t}`).join("\n");
        const completion = await this.openaiClient.chat.completions.create({
            model: modelName,
            messages: [
                {
                    role: "system",
                    content: this.getSystemPrompt(),
                },
                {
                    role: "user",
                    content: `Crea un plan de estudio basado en los siguientes parámetros:

Temas:
${topics}

Duración: ${params.weeks} semanas
Dedicación semanal: ${params.weeklyDedication} horas
Fecha de inicio: ${params.startDate || "No especificada"}
Restricciones: ${JSON.stringify(params.restrictions || {}, null, 2)}
origin: ${modelName}

Recuerda: sigue el proceso paso a paso y devuelve SOLO el JSON.`,
                },
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "study_plan",
                    schema: this.getResponseSchema(),
                    strict: true,
                },
            },
        });

        this.logger.info("Received study plan from OpenRouter model.");
        this.logger.debug(`Study plan response: ${JSON.stringify(completion)}`);

        const messageContent = completion.choices[0].message.content;
        this.logger.debug(`Model message content: ${messageContent}`);
        let studyPlan: Plan;

        try {
            if (!messageContent) throw new Error("Empty response from model.");
            studyPlan = JSON.parse(messageContent) as Plan;
        } catch (error) {
            this.logger.error(
                "Failed to parse study plan JSON from model response.",
                { error }
            );
            throw new Error("Invalid JSON format received from model.");
        }

        return studyPlan;
    }

    private getResponseSchema() {
        return {
            type: "object",
            properties: {
                weeks: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            weekNumber: { type: "integer" },
                            startDate: { type: "string" },
                            endDate: { type: "string" },
                            topics: {
                                type: "array",
                                items: { type: "string" },
                            },
                            activities: {
                                type: "array",
                                items: { type: "string" },
                            },
                            estimatedHours: { type: "number" },
                            milestone: { type: "string" },
                        },
                        required: [
                            "weekNumber",
                            "startDate",
                            "endDate",
                            "topics",
                            "activities",
                            "estimatedHours",
                        ],
                    },
                },
                metadata: {
                    type: "object",
                    properties: {
                        origin: { type: "string" },
                        generatedAt: { type: "string" },
                    },
                    required: ["origin", "generatedAt"],
                },
            },
            required: ["weeks", "metadata"],
        };
    }

    private getSystemPrompt(): string {
        return `# ROL
Eres un asistente experto en la creación de planes de estudio personalizados para estudiantes universitarios.
Tu tarea es ayudar a los estudiantes a organizar su tiempo de estudio de manera efectiva, teniendo en cuenta sus objetivos, duración del curso, dedicación semanal y cualquier restricción que puedan tener.

# PROCESO DE RAZONAMIENTO (Chain-of-Thought)
Para crear un plan de estudio óptimo, sigue estos pasos:

1. **Calcular fechas**: Si hay fecha de inicio, calcula startDate y endDate para cada semana (asume semanas de 7 días, lunes a domingo).
2. **Analizar los temas**: Revisa la lista de temas y agrúpalos por complejidad o dependencias lógicas.
3. **Calcular distribución**: Divide los temas entre las semanas disponibles de forma equilibrada.
4. **Asignar horas**: Distribuye la dedicación semanal entre los temas de cada semana.
5. **Considerar restricciones**: Ajusta el plan si hay vacaciones, semanas bloqueadas o hitos específicos.
6. **Crear actividades**: Para cada semana, define actividades concretas y progresivas.
7. **Validar cobertura**: Asegúrate de que todos los temas estén cubiertos al menos una vez.

# FORMATO DE RESPUESTA
Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta:

{
  "weeks": [
    {
      "weekNumber": number,
      "startDate": "YYYY-MM-DD" o "",
      "endDate": "YYYY-MM-DD" o "",
      "topics": [string],
      "activities": [string],
      "estimatedHours": number,
      "milestone": string (opcional)
    }
  ],
  "metadata": {
    "origin": "tngtech/deepseek-r1t-chimera:free",
    "generatedAt": "ISO 8601 timestamp"
  }
}

# EJEMPLOS (Few-Shot Learning)

## Ejemplo 1: Plan para React (2 semanas, 3 horas/semana, con fecha de inicio)
Input:
- Temas: ["Introducción a React", "JSX", "Componentes", "Props", "State", "Hooks"]
- Semanas: 2
- Dedicación: 3 horas/semana
- Fecha de inicio: 2025-11-04

Output:
{
  "weeks": [
    {
      "weekNumber": 1,
      "startDate": "2025-11-04",
      "endDate": "2025-11-10",
      "topics": ["Introducción a React", "JSX", "Componentes"],
      "activities": [
        "Leer documentación oficial de React",
        "Crear primer componente funcional",
        "Practicar sintaxis JSX con ejemplos"
      ],
      "estimatedHours": 3
    },
    {
      "weekNumber": 2,
      "startDate": "2025-11-11",
      "endDate": "2025-11-17",
      "topics": ["Props", "State", "Hooks"],
      "activities": [
        "Implementar comunicación entre componentes con props",
        "Crear componente con estado usando useState",
        "Practicar useEffect para side effects"
      ],
      "estimatedHours": 3
    }
  ],
  "metadata": {
    "origin": "tngtech/deepseek-r1t-chimera:free",
    "generatedAt": "2025-11-02T22:00:00.000Z"
  }
}

## Ejemplo 2: Plan para Python (3 semanas, 5 horas/semana, con restricciones y fechas)
Input:
- Temas: ["Sintaxis básica", "Estructuras de datos", "Funciones", "POO", "Módulos"]
- Semanas: 3
- Dedicación: 5 horas/semana
- Fecha de inicio: 2025-11-18
- Restricciones: { "blockedWeeks": [2], "milestones": { "3": "Examen parcial" } }

Output:
{
  "weeks": [
    {
      "weekNumber": 1,
      "startDate": "2025-11-18",
      "endDate": "2025-11-24",
      "topics": ["Sintaxis básica", "Estructuras de datos"],
      "activities": [
        "Completar tutorial de sintaxis Python",
        "Practicar listas, tuplas y diccionarios",
        "Resolver 10 ejercicios de manipulación de datos"
      ],
      "estimatedHours": 5
    },
    {
      "weekNumber": 2,
      "startDate": "2025-11-25",
      "endDate": "2025-12-01",
      "topics": [],
      "activities": ["Semana bloqueada - Vacaciones"],
      "estimatedHours": 0
    },
    {
      "weekNumber": 3,
      "startDate": "2025-12-02",
      "endDate": "2025-12-08",
      "topics": ["Funciones", "POO", "Módulos"],
      "activities": [
        "Crear funciones reutilizables",
        "Implementar clases y objetos",
        "Importar y usar módulos estándar",
        "Preparar y realizar examen parcial"
      ],
      "estimatedHours": 5,
      "milestone": "Examen parcial"
    }
  ],
  "metadata": {
    "origin": "tngtech/deepseek-r1t-chimera:free",
    "generatedAt": "2025-11-02T22:00:00.000Z"
  }
}

# REGLAS IMPORTANTES
- SOLO devuelve el JSON, sin texto adicional antes o después
- Usa comillas dobles para strings en JSON
- El campo "generatedAt" debe ser la fecha/hora actual en formato ISO 8601
- Si hay fecha de inicio, CALCULA las fechas startDate y endDate para cada semana (cada semana dura 7 días)
- Si NO hay fecha de inicio, usa cadena vacía "" para startDate y endDate
- Formato de fechas: YYYY-MM-DD
- Distribuye los temas de forma equilibrada entre semanas
- Las actividades deben ser específicas y accionables`;
    }
}
