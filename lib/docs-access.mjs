export async function validCredentials(header, password) {
  if (!password || !header || header.length > 4096) return false
  const match = /^Basic ([A-Za-z0-9+/]+=*)$/i.exec(header)
  if (!match) return false
  let supplied
  try {
    supplied = atob(match[1])
  } catch {
    return false
  }
  const encoder = new TextEncoder()
  const [actual, expected] = await Promise.all(
    [supplied, `docs:${password}`].map(value =>
      crypto.subtle.digest('SHA-256', encoder.encode(value))
    )
  )
  const a = new Uint8Array(actual)
  const b = new Uint8Array(expected)
  let difference = 0
  for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i]
  return difference === 0
}
