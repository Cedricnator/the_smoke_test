import type { BaseSchema, InferOutput } from "valibot";
import { parse } from "valibot";
import type { EnvValidator } from "./env.adapter";

export class ValibotEnvAdapter<TSchema extends BaseSchema<any, any, any>> implements EnvValidator<InferOutput<TSchema>> {
  constructor(private readonly schema: TSchema) {}

  validate(data: unknown): InferOutput<TSchema> {
    return parse(this.schema, data);
  }
}
