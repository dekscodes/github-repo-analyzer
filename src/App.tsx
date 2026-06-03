/**
 * App — root component of the app. Connects all the parts together.
 *
 * @author Dekscodes
 * @date   03-06-2026
 */

import { useState, type FormEvent } from 'react'
import { parseGithubUrl, type ParsedRepo } from './parseGithubUrl'
import { fetchRepoData, type RepoData } from './fetchRepoData'
import { fetchLanguages, type LanguageStat } from './fetchLanguages'

function App() {
  const [url, setUrl] = useState('')
  const [repoData, setRepoData] = useState<RepoData | null>(null)
  const [languages, setLanguages] = useState<LanguageStat[]>([])
  const [loading, setLoading] = useState(false)
  const [parsedRepo, setParsedRepo] = useState<ParsedRepo | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setParsedRepo(null)
    setRepoData(null)
    setLanguages([])

    // Try to parse the repository URL and fetch the repository data and languages
    try {
      const result = parseGithubUrl(url)
      setParsedRepo(result)

      setLoading(true)

      // Fetch the repository data and languages in parallel
      const [data, langs] = await Promise.all([
        fetchRepoData(result.owner, result.repo),
        fetchLanguages(result.owner, result.repo),
      ])

      // Set the repository data and languages
      setRepoData(data)
      setLanguages(langs)
      // If there is an error, set the error message
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse repository URL')
    } finally {
      setLoading(false)
    }
  }

  // Return the main app component with the UI
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">
          GitHub Repo Analyzer
        </h1>
        <p className="mt-2 text-slate-400">
          Paste a public GitHub repository URL to analyze the project.
        </p>

        {/* Form to submit the URL */}
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

        {/* Display the error if it exists */}
        {error && (
          <p className="mt-6 rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">
            {error}
          </p>
        )}

        {/* Display the parsed repository data if it exists */}
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

        {/* Display the repository data if it exists */}  
        {repoData && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Stat label="Stars" value={String(repoData.stars)} />
            <Stat label="Open issues" value={String(repoData.openIssues)} />
            <Stat label="Language" value={repoData.language ?? 'Unknown'} />
            <Stat label="Last update" value={new Date(repoData.lastUpdate).toLocaleDateString()} />
          </div>
        )}

        {/* Display the languages if there are any */}  
        {languages.length > 0 && (
          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">
              Languages
            </p>
            <div className="space-y-3">
              {languages.map((lang) => (
                <LanguageBar key={lang.name} lang={lang} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// Display a single stat with a label and a value
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-mono text-violet-300">{value}</p>
    </div>
  )
}

// Display a single language with a name and a percentage
function LanguageBar({ lang }: { lang: LanguageStat }) {
  // Return the language bar with the name and percentage
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-slate-300">{lang.name}</span>
        <span className="font-mono text-violet-300">{lang.percentage}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-violet-600"
          style={{ width: `${lang.percentage}%` }}
        />
      </div>
    </div>
  )
}

export default App
