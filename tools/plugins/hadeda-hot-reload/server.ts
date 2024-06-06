import { Elysia } from "elysia"

export default process.env.NODE_ENV === "development"
  ? new Elysia({ name: "hot-reload" }).ws("/ws", {})
  : new Elysia({ name: "hot-reload" })
