import Elysia from "elysia"
import { html } from "@elysiajs/html"
import { auth } from "./auth"
import { sessionHelpers } from "./auth/session-helpers"

export const services = new Elysia({ name: "services" })
  .use(html({ autoDoctype: false }))
  .decorate("auth", auth)
  .derive(
    { as: "global" },
    async ({ request, cookie }) => await sessionHelpers.read(request, cookie),
  )
