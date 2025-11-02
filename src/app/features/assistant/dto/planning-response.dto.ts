import { z } from "zod";

export const planningResponseSchema = z.object({
    response: z.string().min(1, "Response cannot be empty"),
});

export type PlanningResponseDto = z.infer<typeof planningResponseSchema>;
