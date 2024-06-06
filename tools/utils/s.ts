export const s = (statements: TemplateStringsArray, ...vars: string[]) =>
  statements.reduce(
    (str, statement, idx) => str + (statement ?? "") + (vars[idx] ?? ""),
    "",
  )
