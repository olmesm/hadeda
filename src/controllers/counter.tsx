import { Elysia } from "elysia"
import { services } from "../services"

export const counter = new Elysia({ prefix: "/counter" })
  .use(services)
  .get("/", async ({ html, db }) => {
    const counter =
      (await db.counter.findFirst()) ??
      (await db.counter.create({ data: { count: 0 } }))

    return html(
      <>
        <button
          hx-post="/counter/clicked"
          hx-trigger="click"
          hx-swap="outerHTML"
          hx-target="#count"
        >
          Click Me!
        </button>

        <p>
          Clicked: <span id="count">{counter.count}</span>
        </p>
      </>,
    )
  })
  .post("/clicked", async ({ html, db }) => {
    const counter = await db.counter.findFirstOrThrow().then((entity) =>
      db.counter.update({
        where: { id: entity!.id },
        data: { count: (entity!.count ?? 0) + 1 },
      }),
    )

    return html(<span id="count">{counter.count}</span>)
  })
