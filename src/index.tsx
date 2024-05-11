import { Elysia } from "elysia"
import { services } from "./services"
import { controllers } from "./controllers"

const app = new Elysia().use(services).use(controllers).listen(3000)

console.log(
  `🐦 Hadeda is running at http://${app.server?.hostname}:${app.server?.port}`,
)

export type App = typeof app
