import { Elysia } from "elysia"
import { services } from "./services/middleware"
import { controllers } from "./controllers"
import { plugins } from "../tools/plugin-globber/server.ts.template"

const app = new Elysia()
  .use(plugins)
  .use(services)
  .use(controllers)
  .listen(process.env.PORT ?? 3000)

console.log(
  `🐦 Hadeda is running at http://${app.server?.hostname}:${app.server?.port}`,
)

export type App = typeof app
