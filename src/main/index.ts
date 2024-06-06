import { Elysia } from "elysia"
import { routes } from "../routes"
import { plugins } from "../plugins/server"

const app = new Elysia()
  .use(plugins)
  .use(routes)
  .listen(process.env.PORT ?? 3000)

console.log(
  `didathing is running at http://${app.server?.hostname}:${app.server?.port}`,
)

export type MainApp = typeof app

MainApp
