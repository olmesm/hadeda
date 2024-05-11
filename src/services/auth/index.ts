import { PrismaAdapter } from "@lucia-auth/adapter-prisma"
import { Lucia } from "lucia"
import { db } from "../db"
import { User as PrismaUser } from "@prisma/client"

const adapter = new PrismaAdapter(db.session, db.user)

export const auth = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV !== "development",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      firstName: attributes.firstName,
      lastName: attributes.lastName,
      email: attributes.email,
    }
  },
})

type DatabaseUserAttributes = Pick<
  PrismaUser,
  "firstName" | "lastName" | "email"
> & {}

declare module "lucia" {
  interface Register {
    Lucia: typeof auth
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}
