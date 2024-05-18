import { Elysia } from "elysia"
import { services } from "./services/middleware"
import { controllers } from "./controllers"
import { hotReload } from "./utils/hot-reload"

const app = new Elysia()
  .use(hotReload)
  .use(services)
  .use(controllers)
  .listen(process.env.PORT ?? 3000)

console.log(
  `🐦 Hadeda is running at http://${app.server?.hostname}:${app.server?.port}`,
)

export type App = typeof app
