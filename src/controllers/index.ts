import { Elysia } from "elysia"
import { staticAssets } from "./static-assets"
import { counter } from "./counter"
import { user } from "./user"
import { home } from "./home"

export const controllers = new Elysia()
  .use(staticAssets)
  .use(user)
  .use(counter)
  .use(home)
