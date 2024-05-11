import { Elysia, t } from "elysia"
import { services } from "../services"
import { Layout } from "../components/layout"
import { sessionHelpers } from "../services/auth/session-helpers"

export const user = new Elysia({ prefix: "/user" })
  .use(services)
  .get("/", ({ html, user }) => {
    return html(
      <details class="dropdown">
        <summary>{user?.firstName ?? "Sign in"}</summary>
        {user ? (
          <ul dir="rtl">
            <li>
              <a href="#" hx-post="/user/sign-out">
                Sign out
              </a>
            </li>
          </ul>
        ) : (
          <ul dir="rtl">
            <li>
              <a href="/user/sign-up">Sign up</a>
            </li>
            <li>
              <a href="/user/sign-in">Sign in</a>
            </li>
          </ul>
        )}
      </details>,
    )
  })
  .get("/sign-up", ({ html }) => {
    return html(
      <Layout>
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
    )
  })
  .post(
    "/sign-up",
    async ({ html, set, body, db, cookie }) => {
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

      set.headers["hx-redirect"] = "/"
      return <>OK</>
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
  .get("/sign-in", ({ html }) => {
    return html(
      <Layout>
        <form hx-post="/user/sign-in">
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
    )
  })
  .post(
    "/sign-in",
    async ({ html, set, body, db, cookie }) => {
      const user = await db.user.findFirst({
        where: {
          email: body.email,
        },
      })
      if (!user) return

      const isMatch = await Bun.password.verify(
        body.password,
        user?.passwordHash,
      )

      if (!isMatch) return

      await sessionHelpers.create(cookie, user.id)

      set.headers["hx-redirect"] = "/"
      return <>OK</>
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
      }),
    },
  )
  .post("/sign-out", async ({ html, request, cookie, set }) => {
    await sessionHelpers.destroy(request, cookie)

    set.headers["hx-redirect"] = "/"
    return <>OK</>
  })
