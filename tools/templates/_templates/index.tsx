import Elysia from "elysia"

export const services = new Elysia({ name: "services" }).decorate("auth", () => {})
