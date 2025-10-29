import { App } from "./app/app";
import { Routes } from "./app/routes";
import { env } from "./app/config/env";

async function main(){
  const appRoutes = new Routes();
  const app = new App({
    port: env.PORT,
    host: env.HOST,
    routes: appRoutes.getRoutes(),
  });
  await app.start();
}

main();