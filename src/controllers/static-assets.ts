import { Elysia } from "elysia"
import { staticPlugin } from "@elysiajs/static"

export const staticAssets = new Elysia()
  .use(staticPlugin())
  .get("/assets/htmx.js", () =>
    Bun.file("node_modules/htmx.org/dist/htmx.min.js"),
  )
  .get("/assets/alpinejs.js", () =>
    Bun.file("node_modules/alpinejs/dist/cdn.min.js"),
  )
  .get("/assets/pico.css", () =>
    Bun.file("node_modules/@picocss/pico/css/pico.min.css"),
  )
