import { verifyRequestOrigin } from "lucia"
import type { User, Session } from "lucia"
import { Cookie } from "elysia"
import { auth } from "."

const create = async (cookie: Record<string, Cookie<any>>, userId: string) => {
  const session = await auth.createSession(userId, {})
  const sessionCookie = auth.createSessionCookie(session.id)
  cookie[sessionCookie.name]?.set({
    value: sessionCookie.value,
    ...sessionCookie.attributes,
  })
}

const read = async (
  request: Request,
  cookie: Record<string, Cookie<any>>,
): Promise<{ user: User | null; session: Session | null }> => {
  // CSRF check
  if (request.method !== "GET") {
    const originHeader = request.headers.get("Origin")
    // NOTE: You may need to use `X-Forwarded-Host` instead
    const hostHeader = request.headers.get("Host")
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      return {
        user: null,
        session: null,
      }
    }
  }

  // use headers instead of Cookie API to prevent type coercion
  const cookieHeader = request.headers.get("Cookie") ?? ""
  const sessionId = auth.readSessionCookie(cookieHeader)
  if (!sessionId) {
    return {
      user: null,
      session: null,
    }
  }

  const { session, user } = await auth.validateSession(sessionId)

  if (session && session.fresh) {
    const sessionCookie = auth.createSessionCookie(session.id)
    cookie[sessionCookie.name]?.set({
      value: sessionCookie.value,
      ...sessionCookie.attributes,
    })
  }
  if (!session) {
    const sessionCookie = auth.createBlankSessionCookie()
    cookie[sessionCookie.name]?.set({
      value: sessionCookie.value,
      ...sessionCookie.attributes,
    })
  }

  return {
    user,
    session,
  }
}

const destroy = async (
  request: Request,
  cookie: Record<string, Cookie<any>>,
) => {
  // use headers instead of Cookie API to prevent type coercion
  const cookieHeader = request.headers.get("Cookie") ?? ""
  const sessionId = auth.readSessionCookie(cookieHeader)

  await auth.invalidateSession(sessionId ?? "")

  const newSessionCookie = auth.createBlankSessionCookie()
  cookie[newSessionCookie.name]?.set({
    value: newSessionCookie.value,
    ...newSessionCookie.attributes,
  })
}

export const sessionHelpers = {
  create,
  read,
  destroy,
}
