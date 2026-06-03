// Set github.com/owner/repo to { owner: 'owner', repo: 'repo'} for the github api

export type ParsedRepo = {
  owner: string
  repo: string
}

export function parseGithubUrl(input: string): ParsedRepo {
  const trimmed = input.trim()

  // If there is no https://, add it.
  const withProtocol = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`

  // A browser-API that parses the URL safely.
  let url: URL
  try {
    url = new URL(withProtocol)
  } catch {
    throw new Error('Ongeldige URL')
  }

  // Only allow github.com links.
  if (url.hostname !== 'github.com') {
    throw new Error('Alleen github.com links zijn toegestaan')
  }

  // Removes empty strings from the pathname.
  const parts = url.pathname.split('/').filter(Boolean)

  if (parts.length < 2) {
    throw new Error('Gebruik: github.com/owner/repo')
  }

  // Also works with .git in the repo name.
  const [owner, repoWithExtra] = parts
  const repo = repoWithExtra.replace(/\.git$/, '').split('/')[0]

  if (!owner || !repo) {
    throw new Error('Owner of repo ontbreekt')
  }

  return { owner, repo }
}
