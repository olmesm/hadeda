import { Elysia } from "elysia"

export const hotReload =
  process.env.NODE_ENV === "development"
    ? new Elysia().ws("/ws", {})
    : new Elysia()

export const HotReloadScript = ({
  delayMs = 150,
  url = "ws://localhost:3000/ws",
}) => (
  <>
    {process.env.NODE_ENV === "development" && (
      <script>{`(${script})(${delayMs}, "${url}")`}</script>
    )}
  </>
)

const script = ((delayMs: number, url: string, reconnectAttemptCount = 0) => {
  const reload = (
    delayMs: number,
    url: string,
    reconnectAttemptCount: number,
  ) => {
    const reconnect = () =>
      setTimeout(() => {
        if (reconnectAttemptCount > 100) return console.log("🍗")
        reload(delayMs, url, reconnectAttemptCount + 1)
      }, delayMs)

    let socket = new WebSocket(url)

    socket.addEventListener("close", reconnect)
    socket.addEventListener(
      "error",
      (error) => socket.OPEN === socket.readyState && console.trace(error),
    )
    socket.addEventListener("open", () => {
      if (reconnectAttemptCount) location.reload()

      console.log("🐦 connected")
    })
  }

  reload(delayMs, url, reconnectAttemptCount)
}).toString()
