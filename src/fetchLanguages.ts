export type LanguageStat = {
  name: string
  bytes: number
  percentage: number
}

export async function fetchLanguages(
  owner: string,
  repo: string
): Promise<LanguageStat[]> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/languages`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch languages')
  }

  const data: Record<string, number> = await response.json()
  const total = Object.values(data).reduce((sum, n) => sum + n, 0)

  if (total === 0) return []

  return Object.entries(data)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / total) * 100),
    }))
    .sort((a, b) => b.bytes - a.bytes)
}
