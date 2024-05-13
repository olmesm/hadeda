import { Elysia } from "elysia"
import { staticPlugin } from "@elysiajs/static"
import { staticScripts } from "../components/head-scripts"

export const staticAssets = staticScripts.reduce(
  (elysia, script) => elysia.get(script.url, () => Bun.file(script.filePath)),
  new Elysia().use(staticPlugin()),
)
