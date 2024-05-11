import { Elysia } from "elysia"
import { staticPlugin } from "@elysiajs/static"
import { scripts } from "../components/layout"

export const staticAssets = scripts.reduce((elysia, script) => {
  const path: string = script.url ?? "/assets/" + script.path.split("/").at(-1)!

  return elysia.get(path, () => Bun.file(script.path))
}, new Elysia().use(staticPlugin()))
