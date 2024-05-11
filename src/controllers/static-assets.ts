import { Elysia } from "elysia"
import { staticPlugin } from "@elysiajs/static"
import { scripts } from "../components/layout"

export const staticAssets = scripts.reduce(
  (elysia, script) => elysia.get(script.url, () => Bun.file(script.filePath)),
  new Elysia().use(staticPlugin()),
)
