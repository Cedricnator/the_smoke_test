export abstract class EnvValidator<T> {
  abstract validate(data: unknown): T;
}
