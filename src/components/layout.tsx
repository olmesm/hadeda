import { Children, Fragment } from "@kitajs/html"

export const Base = ({ children }: { children?: Children }) => (
  <>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hadeda</title>
        <link rel="stylesheet" href="/assets/pico.css" />
        <script src="/assets/htmx.js"></script>
        <script defer src="/assets/alpinejs.js"></script>
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
