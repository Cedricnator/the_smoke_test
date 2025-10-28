import { App } from "./app/app";
import { Routes } from "./app/routes";

async function main(){
  const appRoutes = new Routes();
  const app = new App({
    port: 3000,
    host: 'localhost',
    routes: appRoutes.getRoutes(),
  });
  await app.start();
}

main();