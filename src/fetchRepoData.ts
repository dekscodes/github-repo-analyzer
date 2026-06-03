// Fetch repository information from the Github REST API: GET /repos/:owner/:repo

export type RepoData = {
  name: string
  description: string | null
  stars: number
  openIssues: number
  lastUpdate: string
  language: string | null
}

// Fetch repo data from the Github REST API
export async function fetchRepoData(owner: string, repo: string): Promise<RepoData> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`
  )

  // if response is not ok, throw an error
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Repository not found')
    }
    throw new Error('Failed to fetch repository data')
  }

  // parse the response as json
  const data = await response.json()

  // return the repo data
  return {
    name: data.name,
    description: data.description,
    stars: data.stargazers_count,
    openIssues: data.open_issues_count,
    lastUpdate: data.pushed_at,
    language: data.language,
  }
}
