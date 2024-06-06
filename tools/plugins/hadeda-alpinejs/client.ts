import type { ScriptDefinition } from "./normalise-scripts"

export default [
  {
    type: "js",
    filePath: "node_modules/alpinejs/dist/cdn.min.js",
    props: { defer: true },
  },
] satisfies ScriptDefinition[]
