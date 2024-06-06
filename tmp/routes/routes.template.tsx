import Elysia from "elysia"
import * as controller from "../controller"
import { MainApp } from "../main"

export default new Elysia()
  .use(new Elysia({ prefix: "/controllers" }).use(controller.resource))
  .use(new Elysia({ prefix: "/controllers-2" }).use(controller.update))
