import { App } from "./app/app";
import { Routes } from "./app/routes";
import { env } from "./app/config/env";
import { createLogger } from "./app/config/logger";
import { Logger } from "./app/adapters/logger.adapter";

class Main {
  private readonly logger: Logger;

  constructor(){
    this.logger = createLogger("main");
  }

  /**
   * Bootstrap
   * Initializes and starts the application.
   */
  async bootstrap(): Promise<void> {
    try {
      this.logger.info("Starting application...", { 
        nodeVersion: process.version,
        environment: env.NODE_ENV,
      });

      const routes = new Routes();
      const appRoutes = routes.getRoutes();
      const app = new App({
        port: env.PORT,
        host: env.HOST,
        routes: appRoutes,
        logger: this.logger,
      });
      
      await app.start();
    } catch (error) {
      this.logger.error("Failed to start application", { 
        error: error instanceof Error ? error.message : String(error),
      });
      process.exit(1);
    }
  }
}

const main = new Main();
void main.bootstrap();
