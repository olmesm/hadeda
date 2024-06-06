const hasher = new Bun.CryptoHasher("md5")
export const hash = (str: string) => {
  hasher.update(str)
  return btoa(hasher.digest("base64"))
}
