#!/usr/bin/env bun
import fsp from "fs/promises"
import { camelCase } from "scule"
import { writeTemplate } from "../write"
import { s } from "../utils/s"
import { stripExt } from "../utils/stripExt"
import { glob } from "../utils/glob"

const main = async () => {
  const serverPlugins = await glob("tools/plugins", "**/server.ts")
  const clientPlugins = await glob("tools/plugins", "**/client.ts")

  await writeTemplate(
    `${__dirname}/_templates/server.ts.template`,
    "src/plugins/server.ts",
    {
      imports: serverPlugins
        .map((p) => s`import ${camelCase(stripExt(p))} from "${stripExt(p)}"`)
        .join("\n"),
      uses: serverPlugins
        .map((p) => s`  .use(${camelCase(stripExt(p))})`)
        .join("\n"),
    },
  )

  await writeTemplate(
    `${__dirname}/_templates/client.tsx.template`,
    "src/plugins/client.tsx",
    {
      imports: clientPlugins
        .map((p) => s`import ${camelCase(stripExt(p))} from "${stripExt(p)}"`)
        .join("\n"),
      uses: clientPlugins
        .map((p) => s`    ${camelCase(stripExt(p))},`)
        .join("\n"),
    },
  )

  await fsp.cp(
    `${__dirname}/normalise-scripts.ts`,
    "src/plugins/normalise-scripts.ts",
    { force: true },
  )

  await fsp.cp(`${__dirname}/../plugins`, "node_modules", {
    force: true,
    recursive: true,
  })
}

main()
