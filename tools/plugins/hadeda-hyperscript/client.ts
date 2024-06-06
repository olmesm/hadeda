import type { ScriptDefinition } from "./normalise-scripts"

export default [
  {
    type: "js",
    filePath: "node_modules/hyperscript.org/dist/_hyperscript.min.js",
    props: { defer: true },
  },
] satisfies ScriptDefinition[]
