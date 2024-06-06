export const glob = (dir: string, pattern: string) => {
  const glob = new Bun.Glob(pattern)

  return Array.from(glob.scanSync(dir))
}
