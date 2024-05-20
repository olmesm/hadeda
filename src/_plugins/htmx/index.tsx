import type { ScriptDefinition } from "../utils/normalise-scripts"

export default [
  {
    type: "js",
    filePath: "node_modules/htmx.org/dist/htmx.min.js",
    headerInitialization: (
      <script>htmx.config.globalViewTransitions = true;</script>
    ),
  },
  {
    type: "js",
    filePath: "node_modules/htmx.org/dist/ext/response-targets.js",
    props: { defer: true },
  },
] satisfies ScriptDefinition[]
