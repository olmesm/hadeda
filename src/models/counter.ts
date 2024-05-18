import { db } from "../services/db"

export const counterModel = {
  value: async () => {
    const count =
      (await db.counter.findFirst()) ??
      (await db.counter.create({ data: { count: 0 } }))
    return count.count
  },
  increment: async () => {
    const counter = await db.counter.findFirstOrThrow().then((entity) =>
      db.counter.update({
        where: { id: entity!.id },
        data: { count: (entity!.count ?? 0) + 1 },
      }),
    )

    return counter.count
  },
}
