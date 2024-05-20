import { ScriptDefinition, normaliseScript } from "./utils/normalise-scripts"
import { hotReloadScript } from "./hot-reload"
import htmx from "./htmx"
import hyperscript from "./hyperscript"
import picocss from "./picocss"
// import tailwind from "./tailwind"

export const staticScripts = ([] as ScriptDefinition[])
  .concat(
    htmx,
    hyperscript,
    picocss,
    // tailwind,
    hotReloadScript({}),
  )
  .map(normaliseScript)

export const HeadScripts = ({
  scripts = staticScripts,
}: {
  scripts?: ScriptDefinition[]
}) => (
  <>
    {scripts.map((script) => {
      const safeHhtml = []

      if (script.url) {
        safeHhtml.push(
          script.type === "js" ? (
            <script src={script.url} {...script.props}></script>
          ) : (
            <link rel="stylesheet" href={script.url} {...script.props} />
          ),
        )
      }

      if (script.headerInitialization) {
        safeHhtml.push(script.headerInitialization)
      }

      return <>{safeHhtml}</>
    })}
  </>
)
