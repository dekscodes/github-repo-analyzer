import { useState, type FormEvent } from 'react'
import { parseGithubUrl, type ParsedRepo } from './parseGithubUrl'
import { fetchRepoData, type RepoData } from './fetchRepoData'

function App() {
  const [url, setUrl] = useState('')
  const [repoData, setRepoData] = useState<RepoData | null>(null)
  const [loading, setLoading] = useState(false)
  const [parsedRepo, setParsedRepo] = useState<ParsedRepo | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setParsedRepo(null)
    setRepoData(null)
  
    try {
      const result = parseGithubUrl(url)
      setParsedRepo(result)

      setLoading(true)
      const data = await fetchRepoData(result.owner, result.repo)
      setRepoData(data)
    } catch (err) 
    {
      setError(err instanceof Error ? err.message : 'Failed to parse repository URL')
    } finally {
      setLoading(false)
    }
    
  }
  
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">
          GitHub Repo Analyzer
        </h1>
        <p className="mt-2 text-slate-400">
          Paste a public GitHub repository URL to analyze the project.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/dekscodes/dekscodes-laravel-movies"
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        {error && 
          (
            <p className="mt-6 rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">
              {error}
            </p>
          )
        }
        {parsedRepo && (
          <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-300">
            <p>
              <span className="text-slate-400">Owner:</span>{' '}
              <span className="font-mono text-violet-300">{parsedRepo.owner}</span>
            </p>
            <p className="mt-2">
              <span className="text-slate-400">Repo:</span>{' '}
              <span className="font-mono text-violet-300">{parsedRepo.repo}</span>
            </p>
          </div>
        )}
          {repoData && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Stat label="Stars" value={String(repoData.stars)} />
              <Stat label="Open issues" value={String(repoData.openIssues)} />
              <Stat label="Language" value={repoData.language ?? 'Unknown'} />
              <Stat label="Last update" value={new Date(repoData.lastUpdate).toLocaleDateString()} />
            </div>
          )}
      </main>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-mono text-violet-300">{value}</p>
    </div>
  )
}

export default App