export type ScriptDefinition = {
  filePath: string
  type: "css" | "js"
  url?: string
  props?: Record<string, any>
}

type ScriptObject = ScriptDefinition & { url: string }

export const normaliseScript = (script: ScriptDefinition): ScriptObject => ({
  ...script,
  url: script.url ?? `/assets/${script.filePath.split("/").at(-1)!}`,
})
