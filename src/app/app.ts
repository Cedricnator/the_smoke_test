import express, {
  Router,
  Express,
  Request,
  Response,
  NextFunction,
} from "express";
import type { Logger } from "./adapters/logger.adapter";

interface AppOptions {
  port: number;
  host: string;
  routes: Router;
  logger: Logger;
}

export class App {
  private readonly port: number;
  private readonly host: string;
  private readonly server: Express;
  private readonly routes: Router;
  private readonly logger: Logger;

  constructor(opts: AppOptions) {
    this.port = opts.port;
    this.host = opts.host;
    this.server = express();
    this.routes = opts.routes;
    this.logger = opts.logger;
  }

  /**
   * Sets up CORS headers to allow cross-origin requests.
   * @returns {Express} instance with CORS configured.
   */
  private configureCors(): Express {
    return this.server.use(
      async (req: Request, res: Response, next: NextFunction) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
        next();
      },
    );
  }

  /**
   * Start the Express server
   * @returns {void}
   */
  async start(): Promise<void> {
    this.configureCors();
    this.server.use(express.json());
    this.server.use(this.routes);
    return new Promise<void>((resolve) => {
      this.server.listen(this.port, this.host, () => {
        this.logger.info("☘️  Routes configured.");
        this.logger.info("Server started");
        this.logger.info("Available endpoints:");
        this.logger.info("[GET]  /health");
        this.logger.info("[POST] /api/v1/assistant/study-plan");
        this.logger.info(
          `Server running at http://${this.host}:${this.port}/`,
          {
            port: this.port,
            host: this.host,
            environment: process.env.NODE_ENV,
          },
        );
        resolve();
      });
    });
  }
}

