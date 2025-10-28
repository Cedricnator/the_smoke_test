import express, { Router } from 'express';

interface OptionsConstructor {
  port: number;
  host: string;
  routes: Router;
}

export class App {
  private readonly server = express();
  private readonly port: number;
  private readonly host: string;  
  private readonly routes: Router;

  constructor(opts: OptionsConstructor) {
    this.port = opts.port;
    this.host = opts.host;
    this.routes = opts.routes;
  }

  private configureMiddlewares(){
    this.server.use(express.json());
  }

  private configureCors(){
    this.server.use((req, res, next) => {
      res.append('Access-Control-Allow-Origin', ['*']);
      res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      next();
    });
  }

  async start(){
    this.configureMiddlewares();
    this.configureCors();

    this.server.use(this.routes);

    return new Promise<void>((resolve) => {
      this.server.listen(this.port, this.host, () => {
        console.log(`Server running at http://${this.host}:${this.port}/`);
        resolve();
      });
    });
  }
}  