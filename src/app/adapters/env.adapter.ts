export interface EnvValidator<T> {
  validate(data: unknown): T;
}
