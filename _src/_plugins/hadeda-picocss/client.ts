import type { ScriptDefinition } from "./normalise-scripts"

export default [
  {
    type: "css",
    filePath: "node_modules/@picocss/pico/css/pico.min.css",
  },
  {
    type: "css",
    filePath: "node_modules/@picocss/pico/css/pico.colors.min.css",
  },
] satisfies ScriptDefinition[]
