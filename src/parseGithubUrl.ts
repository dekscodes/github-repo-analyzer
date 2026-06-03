export type ParsedRepo = {
    owner: string
    repo: string
  }
  
  export function parseGithubUrl(input: string): ParsedRepo {
    const trimmed = input.trim()
  
    // Also works without https://. Example: github.com/owner/repo
    const withProtocol = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
  
    let url: URL
    try {
      url = new URL(withProtocol)
    } catch {
      throw new Error('Ongeldige URL')
    }
  
    if (url.hostname !== 'github.com') {
      throw new Error('Alleen github.com links zijn toegestaan')
    }
  
    // pathname = "/owner/repo"
    const parts = url.pathname.split('/').filter(Boolean) // .filter(boolean) to remove empty strings.
  
    if (parts.length < 2) {
      throw new Error('Gebruik: github.com/owner/repo')
    }
  
    const [owner, repoWithExtra] = parts
    // repo name = first segment, without .git and without /tree/main etc.
    const repo = repoWithExtra.replace(/\.git$/, '').split('/')[0]
  
    if (!owner || !repo) {
      throw new Error('Owner of repo ontbreekt')
    }
  
    return { owner, repo }
  }