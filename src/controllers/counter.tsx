import { Elysia } from "elysia"
import { services } from "../services/middleware"
import { counterModel } from "../models/counter"

export const counter = new Elysia({ prefix: "/counter" })
  .use(services)
  .get("/", async () => {
    return (
      <article>
        <p>
          Clicked <span id="count">{counterModel.value()}</span> times
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
  .post("/clicked", async () => {
    return <span id="count">{counterModel.increment()}</span>
  })
