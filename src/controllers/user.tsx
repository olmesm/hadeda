import { Elysia, t } from "elysia"
import { services } from "../services"
import { Layout } from "../components/layout"
import { sessionHelpers } from "../services/auth/session-helpers"

export const user = new Elysia({ prefix: "/user" })
  .use(services)
  .get("/sign-up", ({ html }) =>
    html(
      <Layout>
        <h1>Sign up</h1>
        <form hx-post="/user/sign-up">
          <fieldset class="grid">
            <label for="firstName">
              First Name
              <input id="firstName" name="firstName" />
            </label>
            <label for="lastName">
              Last Name
              <input id="lastName" name="lastName" />
            </label>
          </fieldset>

          <fieldset class="grid">
            <label for="email">
              Email
              <input id="email" name="email" />
            </label>

            <label for="password">
              Password
              <input type="password" id="password" name="password" />
            </label>
          </fieldset>

          <input type="submit" />
        </form>
      </Layout>,
    ),
  )
  .post(
    "/sign-up",
    async ({ set, body, db, cookie }) => {
      // validate

      const passwordHash = await Bun.password.hash(body.password)

      const user = await db.user.create({
        data: {
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          passwordHash,
        },
      })

      await sessionHelpers.create(cookie, user.id)

      return (set.redirect = "/")
    },
    {
      body: t.Object({
        email: t.String({
          format: "email",
        }),
        password: t.String({
          minLength: 8,
          maxLength: 64,
        }),
        firstName: t.String({
          minLength: 3,
          maxLength: 32,
        }),
        lastName: t.String({
          minLength: 3,
          maxLength: 32,
        }),
      }),
    },
  )
