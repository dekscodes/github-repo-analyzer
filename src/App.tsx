import { useState, type FormEvent } from 'react'

function App() {
  const [url, setUrl] = useState('')
  const [submittedUrl, setSubmittedUrl] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmittedUrl(url.trim())
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
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/dekscodes/dekscodes-laravel-movies"
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            required
          />
          <button
            type="submit"
            className="rounded-lg bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-500"
          >
            Analyze
          </button>
        </form>

        {submittedUrl && (
          <p className="mt-6 rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-300">
            Ingediende URL:{' '}
            <span className="font-mono text-violet-300">{submittedUrl}</span>
          </p>
        )}
      </main>
    </div>
  )
}

export default App