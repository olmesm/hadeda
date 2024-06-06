import { Elysia } from "elysia"
import { services } from "../services/middleware"
import { Layout } from "../components/layout"

export const home = new Elysia({ prefix: "/" })
  .use(services)
  .get("/", async ({ user }) => (
    <Layout>
      <div class="grid">
        <article>
          <a href="https://www.facebook.com/watch/?v=349634689158696">
            Don't tell Pharrell!
          </a>
        </article>

        <div hx-get="/counter" hx-trigger="load" hx-swap="innerHTML"></div>
      </div>

      {user ? (
        <article>
          <table>
            <tbody>
              <tr>
                <th scope="row">ID</th>
                <td safe>{user.id}</td>
              </tr>
              <tr>
                <th scope="row">email</th>
                <td>{user.email}</td>
              </tr>
              <tr>
                <th scope="row">First Name</th>
                <td safe>{user.firstName}</td>
              </tr>
              <tr>
                <th scope="row">Last Name</th>
                <td safe>{user.lastName}</td>
              </tr>
            </tbody>
          </table>
        </article>
      ) : (
        <></>
      )}
    </Layout>
  ))
