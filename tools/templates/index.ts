#!/usr/bin/env bun
import { plural } from "pluralize"
import { pascalCase, camelCase, kebabCase } from "scule"

import { exists, readdir } from "fs/promises"
import { parse as pathParse } from "path"
import { writeTemplate, appendTemplate, write, processTemplate } from "../write"
import { s } from "../utils/s"

const [_, __, templateType, entityName] = process.argv

const templateTypes = ["route", "page", "model", "controller"]
const taskRunTypes = ["full", "gen-controller"]
type TemplateTypes = (typeof templateTypes)[number] &
  (typeof taskRunTypes)[number]

const createCases = (entityName: string) => {
  const entity = entityName
  const entities = plural(entityName)
  const kebabCased = kebabCase(entityName)
  const camelCased = camelCase(entityName)
  const pascalCased = pascalCase(entityName)

  return { entity, entities, kebabCased, camelCased, pascalCased }
}

const main = async (templateType: TemplateTypes, entityName?: string) => {
  if (!entityName) throw new Error("Please include a singular entitiy name")
  const data = createCases(entityName)

  switch (templateType) {
    case "route": {
      const outPath = "src/routes/index.ts"
      const baseFile = await exists(outPath).then((exists) =>
        exists
          ? Bun.file(outPath).text()
          : Bun.file(`${__dirname}/_templates/routes.tsx.template`).text(),
      )

      await write(
        outPath,
        [
          s`import * as ${data.entities}Controller from "../controllers/${kebabCase(data.entities)}"`,
          baseFile.trim(),
          s`  .use(new Elysia({ prefix: "/${data.entities}" }).use(${data.entities}Controller.resource))`,
        ].join("\n"),
        true,
      )

      return
    }
    case "controller": {
      const outPath = `src/controllers/${kebabCase(data.entities)}.tsx`

      await writeTemplate(
        `${__dirname}/_templates/controller.tsx.template`,
        outPath,
        data,
      )

      return
    }
    case "page": {
      const type = "index"
      const outPath = `src/views/${kebabCase(data.entities)}/${type}.tsx`

      await writeTemplate(
        `${__dirname}/_templates/page.tsx.template`,
        outPath,
        {
          ...data,
          type,
        },
      )

      return
    }
    case "model": {
      const outPath = `src/models/${kebabCase(data.entity)}.ts`

      await writeTemplate(
        `${__dirname}/_templates/model.ts.template`,
        outPath,
        data,
      )

      return
    }

    case "full": {
      await Promise.all(templateTypes.map((t) => main(t, entityName)))

      return
    }

    case "gen-controllers": {
      const _templateType = templateType.split("-")[1]!
      await handleGen(_templateType, entityName)
      return
    }

    default:
      throw new Error(
        "Please use a specified template type. Allowed values are: " +
          [...templateTypes, ...taskRunTypes].join(", "),
      )
  }
}

const handleGen = async (templateType: TemplateTypes, entityName?: string) => {
  if (!entityName) throw new Error("Please include a singular entitiy name")

  switch (templateType) {
    case "controllers": {
      const excludeList = ["index"]
      const fileList = (await readdir(`src/${templateType}`)).filter(
        (f) => !excludeList.find((x) => f.startsWith(x)),
      )

      const exportSnippet = `export * as {{ camelCased }} from "./{{ kebabCased }}"`

      const outputRaw = fileList.reduce((acc, fileName) => {
        const name = pathParse(fileName).name

        return (
          acc +
          processTemplate(exportSnippet, {
            camelCased: camelCase(name),
            kebabCased: name,
          }) +
          "\n"
        )
      }, "")

      await write("src/controllers/index.ts", outputRaw, true)
      return
    }

    default:
      throw new Error(
        "Please use a specified template type. Allowed values are: " +
          [...templateTypes, ...taskRunTypes].join(", "),
      )
  }
}

main(templateType as TemplateTypes, entityName)
