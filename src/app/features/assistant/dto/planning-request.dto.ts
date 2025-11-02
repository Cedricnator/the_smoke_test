import { z } from "zod";

export const planningRequestSchema = z.object({
    topics: z
        .array(z.string().min(1, "Topic cannot be empty"))
        .min(1, "At least one topic is required"),
    totalWeeks: z
        .number()
        .int()
        .min(1, "Total weeks must be at least 1")
        .max(52, "Total weeks cannot exceed 52"),
    dedicatedTotalTimePerWeek: z
        .number()
        .min(0.5, "Dedicated time must be at least 0.5 hours")
        .max(168, "Dedicated time cannot exceed 168 hours per week"),
    startingDate: z
        .string()
        .refine(
            (date) => !isNaN(Date.parse(date)),
            "Starting date must be a valid ISO date string"
        ),
});

export type PlanningRequestDto = z.infer<typeof planningRequestSchema>;
