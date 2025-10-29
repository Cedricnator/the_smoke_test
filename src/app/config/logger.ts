import pino from "pino";
import type { Logger } from "../adapters/logger.adapter";
import { PinoLoggerAdapter } from "../adapters/pino-logger.adapter";
import { env } from "./env";

class LoggerFactory {
  private static instance: Logger;
  private static childLoggers: Map<string, Logger> = new Map();

  private constructor() {}

  /**
   * GetInstance
   * -----------
   * Returns the singleton logger instance. 
   * @returns Logger instance
   */ 
  static getInstance(): Logger {
    if (!LoggerFactory.instance) {
      const pinoInstance = pino({
        level: env.NODE_ENV === "production" ? "info" : "debug",
        transport:
          env.NODE_ENV === "development"
            ? {
                target: "pino-pretty",
                options: {
                  colorize: true,
                  translateTime: "HH:MM:ss Z",
                  ignore: "pid,hostname",
                  singleLine: true,
                },
              }
            : undefined,
        serializers: {
          req: (req) => ({
            method: req.method,
            url: req.url,
            headers: {
              ...req.headers,
              authorization: undefined,
              cookie: undefined,
              "x-api-key": undefined,
            },
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
          err: pino.stdSerializers.err,
        },
      });

      LoggerFactory.instance = new PinoLoggerAdapter(pinoInstance);
    }

    return LoggerFactory.instance;
  }
  
  /**
   * GetChildLogger
   * --------------
   * Returns a child logger with the specified service name.
   * @param {string} service - Name of the service for the child logger
   * @returns Child Logger instance
   */
  static getChildLogger(service: string): Logger {
    if (!LoggerFactory.childLoggers.has(service)) {
      const childLogger = LoggerFactory.getInstance().child({ service });
      LoggerFactory.childLoggers.set(service, childLogger);
    }

    return LoggerFactory.childLoggers.get(service)!;
  }
}

// Singleton instance
export const logger = LoggerFactory.getInstance();

// Factory for child loggers
export const createLogger = (service: string): Logger => {
  return LoggerFactory.getChildLogger(service);
};
