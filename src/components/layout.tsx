import { Children } from "@kitajs/html"

export const scripts: {
  path: string
  type: "css" | "js"
  url?: string
  props?: Record<string, any>
}[] = [
  {
    type: "js",
    path: "node_modules/htmx.org/dist/htmx.min.js",
  },
  {
    type: "js",
    path: "node_modules/htmx.org/dist/ext/response-targets.js",
  },
  {
    props: { defer: true },
    type: "js",
    path: "node_modules/alpinejs/dist/cdn.min.js",
  },
  {
    type: "css",
    path: "node_modules/@picocss/pico/css/pico.min.css",
  },
  {
    type: "css",
    path: "node_modules/@picocss/pico/css/pico.colors.min.css",
  },
]

export const Base = ({ children }: { children?: Children }) => (
  <>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hadeda</title>
        {scripts.map((script) =>
          script.type === "js" ? (
            <script
              src={script.url ?? "/assets/" + script.path.split("/").at(-1)}
              {...script.props}
            ></script>
          ) : (
            <link
              rel="stylesheet"
              href={script.url ?? "/assets/" + script.path.split("/").at(-1)}
              {...script.props}
            />
          ),
        )}

        <link rel="icon" type="image/svg+xml" href="/public/favico.svg" />
        <script>htmx.config.globalViewTransitions = true;</script>
      </head>
      <body>{children}</body>
    </html>
  </>
)

export const Layout = ({ children }: { children?: Children }) => (
  <Base>
    <main class="container">
      <nav>
        <ul>
          <li>
            <a class="contrast" href="/">
              <strong>🐦 Hadeda</strong>
            </a>
          </li>
        </ul>
        <ul>
          <li hx-get="/user" hx-trigger="load" hx-swap="innerHTML"></li>
        </ul>
      </nav>
      {children}
    </main>
  </Base>
)
