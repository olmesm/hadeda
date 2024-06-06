export type ScriptDefinition = {
  filePath?: string
  type?: "css" | "js"
  url?: string | undefined
  props?: Record<string, any>
  headerInitialization?: JSX.Element
}

export const normaliseScript = (
  script: ScriptDefinition,
): ScriptDefinition => ({
  ...script,
  url:
    script.url ?? script.filePath
      ? `/assets/${script.filePath!.split("/").at(-1)!}`
      : undefined,
})
