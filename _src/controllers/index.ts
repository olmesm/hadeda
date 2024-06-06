import { Elysia } from "elysia"
import { counter } from "./counter"
import { user } from "./user"
import { home } from "./home"

export const controllers = new Elysia().use(user).use(counter).use(home)
