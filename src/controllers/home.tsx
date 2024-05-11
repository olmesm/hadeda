import { Elysia } from "elysia"
import { services } from "../services"
import { Layout } from "../components/layout"

export const home = new Elysia({ prefix: "/" })
  .use(services)
  .get("/", async ({ html, user }) => {
    return html(
      <Layout>
        <p>
          <a href="https://www.facebook.com/watch/?v=349634689158696">
            Don't`tell Pharrell.
          </a>
        </p>

        <div hx-get="/counter" hx-trigger="load" hx-swap="innerHTML"></div>
      </Layout>,
    )
  })
