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
        <div id="form-errors" class="pico-color-pink" />

        <form
          hx-post="/user/sign-up"
          hx-ext="response-targets"
          hx-target-error="#form-errors"
        >
          <fieldset class="grid">
            <label for="firstName">
              First Name
              <input required id="firstName" name="firstName" />
            </label>
            <label for="lastName">
              Last Name
              <input required id="lastName" name="lastName" />
            </label>
          </fieldset>

          <fieldset class="grid">
            <label for="email">
              Email
              <input required id="email" name="email" />
            </label>

            <label for="password">
              Password
              <input required type="password" id="password" name="password" />
            </label>
          </fieldset>

          <input type="submit" />
        </form>
      </Layout>,
    )
  })
  .post(
    "/sign-up",
    async ({ set, body, db, cookie }) => {
      try {
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
      } catch (e) {
        set.status = "Conflict"

        return "Email already registered"
      }
    },
    {
      body: t.Object({
        email: t.String({
          format: "email",
          error: "Please enter a valid email",
        }),
        password: t.String({
          minLength: 8,
          maxLength: 64,
          error: "Password should be 8 - 64 characters",
        }),
        firstName: t.String({
          minLength: 2,
          maxLength: 32,
          error: "Invalid first name",
        }),
        lastName: t.String({
          minLength: 2,
          maxLength: 32,
          error: "Invalid last name",
        }),
      }),
    },
  )
  .get("/sign-in", ({ html }) => {
    return html(
      <Layout>
        <div id="form-errors" class="pico-color-pink" />

        <form
          hx-post="/user/sign-in"
          hx-ext="response-targets"
          hx-target-error="#form-errors"
        >
          <fieldset class="grid">
            <label for="email">
              Email
              <input required id="email" name="email" />
            </label>

            <label for="password">
              Password
              <input required type="password" id="password" name="password" />
            </label>
          </fieldset>

          <input type="submit" />
        </form>
      </Layout>,
    )
  })
  .post(
    "/sign-in",
    async ({ set, body, db, cookie }) => {
      const user = await db.user.findFirst({
        where: {
          email: body.email,
        },
      })
      if (!user) {
        set.status = "Unprocessable Content"
        return "Invalid details"
      }

      const isMatch = await Bun.password.verify(
        body.password,
        user?.passwordHash,
      )

      if (!isMatch) {
        set.status = "Unprocessable Content"
        return "Invalid details"
      }

      await sessionHelpers.create(cookie, user.id)

      set.headers["hx-redirect"] = "/"
      return <>OK</>
    },
    {
      body: t.Object({
        email: t.String({
          format: "email",
          error: "Please enter a valid email",
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
