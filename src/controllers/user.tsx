import { Elysia, t } from "elysia"
import { services } from "../services/middleware"
import { Layout } from "../components/layout"
import { sessionHelpers } from "../services/auth/session-helpers"
import { userModel } from "../models/user"

export const user = new Elysia({ prefix: "/user" })
  .use(services)
  .get("/", ({ user }) => {
    return (
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
      </details>
    )
  })
  .get("/sign-up", ({}) => (
    <Layout>
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

        <section id="form-errors" class="pico-color-pink" />

        <input type="submit" />
      </form>
    </Layout>
  ))
  .post(
    "/sign-up",
    async ({ set, body, cookie }) => {
      try {
        const user = await userModel.create(body)

        await sessionHelpers.create(cookie, user.id)

        set.headers["hx-redirect"] = "/"
        return
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
  .get("/sign-in", () => (
    <Layout>
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

        <section id="form-errors" class="pico-color-pink" />

        <input type="submit" />
      </form>
    </Layout>
  ))
  .post(
    "/sign-in",
    async ({ set, body, cookie }) => {
      const maybeUser = await userModel.login(body)

      if (maybeUser instanceof Error) {
        set.status = "Unprocessable Content"
        return maybeUser.message
      }

      await sessionHelpers.create(cookie, maybeUser.id)

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
  .post("/sign-out", async ({ request, cookie, set }) => {
    await sessionHelpers.destroy(request, cookie)

    set.headers["hx-redirect"] = "/"
    return
  })
