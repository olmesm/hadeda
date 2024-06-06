import path from "path"
import tailwind from "tailwindcss"
import postcss from "postcss"

import type { ScriptDefinition } from "./normalise-scripts"

const filePath = path.join(process.cwd(), "src", "index.gen.css")
const tailwindConfigPath = path.join(process.cwd(), "tailwind.config.js")

const sourceCss = "@tailwind base; @tailwind components; @tailwind utilities"

if (process.env.NODE_ENV === "development") {
  postcss([tailwind(tailwindConfigPath)])
    .process(sourceCss, {
      from: undefined,
    })
    .then((result) => Bun.write(filePath, result.css))
}

export default [
  {
    type: "css",
    filePath,
  },
] satisfies ScriptDefinition[]
