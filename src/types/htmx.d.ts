type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head"

type HttpMethods = "get" | "post" | "put" | "delete" | "patch" | "index"

// Helper type to recursively construct valid paths while excluding HTTP methods and "index" from the options
type KeysToString<T> = T extends object
  ? {
      [K in keyof T]: K extends HttpMethods
        ? never
        : T[K] extends object
          ? `${K & string}/${KeysToString<T[K]>}` | `${K & string}`
          : `${K & string}`
    }[keyof T]
  : never

type Schema = import("../index").App["_routes"]

// Type to extract all possible valid routes as string literal union
type ValidRoutes = `/${KeysToString<Schema>}`

declare namespace JSX {
  interface HtmlTag extends Htmx.Attributes {
    ["hx-get"]?: ValidRoutes
    ["hx-post"]?: ValidRoutes
    ["hx-put"]?: ValidRoutes
    ["hx-delete"]?: ValidRoutes
    ["hx-patch"]?: ValidRoutes
  }
}
