import path from "path"

export const stripExt = (filePath: string) =>
  filePath.replace(new RegExp(path.extname(filePath) + "$"), "")
