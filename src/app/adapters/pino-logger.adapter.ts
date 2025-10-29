import pino from "pino";
import type { Logger } from "./logger.adapter";

export class PinoLoggerAdapter implements Logger {
  private readonly logger: pino.Logger;

  constructor(logger: pino.Logger) {
    this.logger = logger;
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.logger.info(context || {}, message);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.logger.error(context || {}, message);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.logger.warn(context || {}, message);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.logger.debug(context || {}, message);
  }

  child(bindings: Record<string, unknown>): Logger {
    return new PinoLoggerAdapter(this.logger.child(bindings));
  }
}
