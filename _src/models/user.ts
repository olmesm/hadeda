import { db } from "../services/db"

export const userModel = {
  create: async ({
    email,
    firstName,
    lastName,
    password,
  }: {
    email: string
    firstName: string
    lastName: string
    password: string
  }) => {
    const passwordHash = await Bun.password.hash(password)

    const user = await db.user.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash,
      },
    })

    return user
  },
  login: async ({ email, password }: { email: string; password: string }) => {
    const user = await db.user.findFirst({
      where: {
        email,
      },
    })

    if (!user) {
      return new Error("Invalid details")
    }

    const isMatch = await Bun.password.verify(password, user?.passwordHash)

    if (!isMatch) {
      return new Error("Invalid details")
    }

    return user
  },
}
