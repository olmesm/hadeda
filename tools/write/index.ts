import { mkdir, exists } from "fs/promises"
import { dirname } from "path"
import * as Handlebars from "handlebars"

export const write = async (
  outFile: string,
  data: string,
  overwrite?: boolean,
) => {
  console.log(`[info] Write ${outFile}`)
  if (!overwrite && (await exists(outFile)))
    throw new Error(`[error] File exists: ${outFile}`)

  await mkdir(dirname(outFile), { recursive: true })

  await Bun.write(outFile, data)
}

export const processTemplate = (
  inFileRaw: string,
  data: Record<string, string | number | undefined>,
) => Handlebars.compile(inFileRaw)(data)

export const writeTemplate = async (
  inFile: string,
  outFile: string,
  data: Record<string, string | number | undefined>,
) => {
  const inFileRaw = await Bun.file(inFile).text()
  const outFileRaw = processTemplate(inFileRaw, data)

  await write(outFile, outFileRaw, true)
}

export const appendTemplate = async (
  inFile: string,
  outFile: string,
  data: Record<string, string | number | undefined>,
) => {
  console.log(`[info] Append ${outFile}`)

  const inFileRaw = await Bun.file(inFile).text()
  const appendFile = await Bun.file(outFile).text()
  const outFileRaw = processTemplate(inFileRaw, data)

  await write(
    outFile,
    appendFile.trim().replace(/;*$/, "") + "\n" + outFileRaw,
    true,
  )
}
