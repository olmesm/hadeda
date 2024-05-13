import { Elysia } from "elysia"
import { services } from "../services"

export const counter = new Elysia({ prefix: "/counter" })
  .use(services)
  .get("/", async ({ db }) => {
    const counter =
      (await db.counter.findFirst()) ??
      (await db.counter.create({ data: { count: 0 } }))

    return (
      <article>
        <p>
          Clicked <span id="count">{counter.count}</span> times
        </p>
        <button
          hx-post="/counter/clicked"
          hx-trigger="click"
          hx-swap="outerHTML"
          hx-target="#count"
        >
          Click Me!
        </button>
      </article>
    )
  })
  .post("/clicked", async ({ db }) => {
    const counter = await db.counter.findFirstOrThrow().then((entity) =>
      db.counter.update({
        where: { id: entity!.id },
        data: { count: (entity!.count ?? 0) + 1 },
      }),
    )

    return <span id="count">{counter.count}</span>
  })
