import { object, string, number, pipe, transform, minLength } from "valibot";
import { ValibotEnvAdapter } from "../adapters/valibot-env.adapter";

const envSchema = object({
  NODE_ENV: pipe(
    string(),
    transform((val) => val || "development")
  ),
  PORT: pipe(
    string(),
    transform((val) => parseInt(val, 10))
  ),
  HOST: string(),
  OPENROUTER_API_KEY: pipe(
    string(),
    minLength(1, "OPENROUTER_API_KEY is required and cannot be empty")
  ),
});

const envValidator = new ValibotEnvAdapter(envSchema);

export const env = envValidator.validate(process.env);
