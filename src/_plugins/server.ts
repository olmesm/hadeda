import { Elysia } from "elysia"
import { staticPlugin } from "@elysiajs/static"
import { staticScripts } from "./html"
import { hotReload } from "./hot-reload/server"

export const plugins = staticScripts
  .reduce(
    (elysia, script) =>
      script.url && script.filePath
        ? elysia.get(script.url, () => Bun.file(script.filePath!))
        : elysia,
    new Elysia({ name: "user-plugins" }).use(staticPlugin()),
  )
  .use(hotReload)
