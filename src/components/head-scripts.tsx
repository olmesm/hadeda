import { ScriptDefinition, normaliseScript } from "../utils/normalise-scripts"
import { HotReloadScript } from "../utils/hot-reload"

export const staticScripts = (
  [
    {
      type: "js",
      filePath: "node_modules/htmx.org/dist/htmx.min.js",
    },
    {
      type: "js",
      filePath: "node_modules/htmx.org/dist/ext/response-targets.js",
      props: { defer: true },
    },
    {
      type: "js",
      filePath: "node_modules/hyperscript.org/dist/_hyperscript.min.js",
      props: { defer: true },
    },
    {
      type: "css",
      filePath: "node_modules/@picocss/pico/css/pico.min.css",
    },
    {
      type: "css",
      filePath: "node_modules/@picocss/pico/css/pico.colors.min.css",
    },
  ] satisfies ScriptDefinition[]
).map(normaliseScript)

export const HeadScripts = ({
  scripts = staticScripts,
}: {
  scripts?: ScriptDefinition[]
}) => (
  <>
    {scripts.map((script) =>
      script.type === "js" ? (
        <script src={script.url} {...script.props}></script>
      ) : (
        <link rel="stylesheet" href={script.url} {...script.props} />
      ),
    )}
    <script>htmx.config.globalViewTransitions = true;</script>

    <HotReloadScript />
  </>
)
