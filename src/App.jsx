import { useEffect, useMemo, useState } from 'react'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import './App.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
)

const DEFAULT_DELAY = 500
const chartPalette = ['#8b5cf6', '#60a5fa', '#34d399', '#f59e0b', '#f472b6']

function generateCollatzSequence(startingNumber) {
  if (!Number.isInteger(startingNumber) || startingNumber <= 0) {
    return []
  }

  const sequence = [startingNumber]
  let currentValue = startingNumber

  while (currentValue !== 1) {
    currentValue = currentValue % 2 === 0 ? currentValue / 2 : currentValue * 3 + 1
    sequence.push(currentValue)
  }

  return sequence
}

function getAverageStepSize(sequence) {
  if (!sequence.length || sequence.length === 1) {
    return 0
  }

  return sequence.reduce((sum, value) => sum + value, 0) / sequence.length
}

function App() {
  const [theme, setTheme] = useState('light')
  const [chartType, setChartType] = useState('line')
  const [inputValue, setInputValue] = useState('')
  const [sequence, setSequence] = useState([])
  const [visibleSequence, setVisibleSequence] = useState([])
  const [comparisonRuns, setComparisonRuns] = useState([])
  const [isPaused, setIsPaused] = useState(false)
  const [animationDelay, setAnimationDelay] = useState(DEFAULT_DELAY)
  const [errorMessage, setErrorMessage] = useState('')
  const [shareMessage, setShareMessage] = useState('')

  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': ['WebApplication', 'EducationalApplication'],
      name: 'Collatz Conjecture Explorer',
      description:
        'Interactive number theory visualizer that explores the Collatz Conjecture, sequence behavior, and famous mathematics problem in plain language.',
      url: 'https://collatz-conjecture-explorer-b6nelo0eo-mikegilkims-projects.vercel.app',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      inLanguage: 'en',
      author: {
        '@type': 'Organization',
        name: 'Collatz Explorer',
      },
      keywords: [
        'Collatz Conjecture',
        'Number Theory Visualizer',
        'Mathematics Sequence',
        'Unsolved Problems',
        'Interactive Math',
      ],
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    }),
    [],
  )

  const isDark = theme === 'dark'
  const maxValue = sequence.length ? Math.max(...sequence) : 0
  const averageStepSize = getAverageStepSize(sequence)
  const totalSteps = Math.max(sequence.length - 1, 0)
  const isComplete = visibleSequence.length >= sequence.length && sequence.length > 0
  const statusLabel = !sequence.length ? 'Ready' : isPaused ? 'Paused' : isComplete ? 'Complete' : 'Running'

  const mutedText = isDark ? 'text-slate-300' : 'text-slate-600'
  const subtle = isDark ? 'bg-slate-800/70 border-slate-700' : 'bg-white/80 border-slate-200'
  const soft = isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
  const buttonPrimary = isDark
    ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-violet-900/40'
    : 'bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-violet-200'
  const secondaryButton = isDark
    ? 'border-slate-700 bg-slate-800 text-slate-200 hover:border-violet-400 hover:text-violet-300'
    : 'border-slate-200 bg-white text-slate-700 hover:border-violet-400 hover:text-violet-600'

  useEffect(() => {
    if (!sequence.length || isPaused || isComplete) {
      return undefined
    }

    const timer = setTimeout(() => {
      setVisibleSequence((currentSequence) => {
        if (currentSequence.length >= sequence.length) {
          return currentSequence
        }

        return sequence.slice(0, currentSequence.length + 1)
      })
    }, animationDelay)

    return () => clearTimeout(timer)
  }, [animationDelay, isComplete, isPaused, sequence, visibleSequence.length])

  const chartData = useMemo(() => {
    const dataSets = []

    if (sequence.length) {
      dataSets.push({
        label: `${inputValue || 'Current'} run`,
        data: visibleSequence,
        borderColor: isDark ? '#8b5cf6' : '#7c3aed',
        backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(124, 58, 237, 0.12)',
        borderWidth: 3,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointBackgroundColor: isDark ? '#e9d5ff' : '#7c3aed',
        tension: 0.35,
        fill: false,
      })
    }

    comparisonRuns.forEach((run, index) => {
      dataSets.push({
        label: run.label,
        data: run.data,
        borderColor: chartPalette[index % chartPalette.length],
        backgroundColor: `${chartPalette[index % chartPalette.length]}55`,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
        fill: false,
        tension: 0.25,
      })
    })

    const labels = Array.from({ length: Math.max(...dataSets.map((set) => set.data.length), 0) }, (_, index) => index)

    return { labels, datasets: dataSets }
  }, [comparisonRuns, inputValue, isDark, sequence.length, visibleSequence])

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 500,
        easing: 'easeOutQuart',
      },
      interaction: {
        mode: 'nearest',
        intersect: false,
      },
      plugins: {
        legend: {
          labels: {
            color: isDark ? '#e2e8f0' : '#334155',
            usePointStyle: true,
            pointStyle: 'circle',
          },
        },
        tooltip: {
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          titleColor: isDark ? '#f8fafc' : '#0f172a',
          bodyColor: isDark ? '#cbd5e1' : '#334155',
          borderColor: isDark ? '#475569' : '#e2e8f0',
          borderWidth: 1,
          callbacks: {
            label: (context) => `Value: ${context.parsed.y}`,
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Step',
            color: isDark ? '#cbd5e1' : '#475569',
          },
          ticks: {
            color: isDark ? '#cbd5e1' : '#475569',
          },
          grid: {
            color: isDark ? 'rgba(148,163,184,0.12)' : 'rgba(148,163,184,0.18)',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Value',
            color: isDark ? '#cbd5e1' : '#475569',
          },
          ticks: {
            color: isDark ? '#cbd5e1' : '#475569',
          },
          grid: {
            color: isDark ? 'rgba(148,163,184,0.12)' : 'rgba(148,163,184,0.18)',
          },
        },
      },
    }),
    [isDark],
  )

  const handleRun = (event) => {
    event.preventDefault()

    const parsedValue = Number(inputValue)

    if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
      setErrorMessage('Please enter a valid positive integer.')
      return
    }

    const nextSequence = generateCollatzSequence(parsedValue)

    setErrorMessage('')
    setShareMessage('')
    setSequence(nextSequence)
    setVisibleSequence([nextSequence[0]])
    setIsPaused(false)
  }

  const handlePause = () => setIsPaused(true)
  const handleResume = () => setIsPaused(false)

  const handleReset = () => {
    setSequence([])
    setVisibleSequence([])
    setComparisonRuns([])
    setIsPaused(false)
    setErrorMessage('')
    setShareMessage('')
    setInputValue('')
  }

  const handleAddComparison = () => {
    if (!sequence.length) {
      return
    }

    setComparisonRuns((runs) => [
      ...runs,
      {
        label: `Compare ${runs.length + 1}`,
        data: sequence,
      },
    ])
  }

  const handleResetComparison = () => setComparisonRuns([])

  const downloadBlob = (filename, content, type) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleExportCsv = () => {
    if (!sequence.length) {
      return
    }

    const csvRows = [['step', 'value'], ...sequence.map((value, index) => [index, value])]
    const csvContent = csvRows.map((row) => row.join(',')).join('\n')
    downloadBlob(`collatz-${sequence[0]}.csv`, csvContent, 'text/csv;charset=utf-8;')
  }

  const handleExportJson = () => {
    if (!sequence.length) {
      return
    }

    const json = JSON.stringify(
      {
        startingNumber: sequence[0],
        totalSteps,
        maxValue,
        averageStepSize,
        sequence,
      },
      null,
      2,
    )

    downloadBlob(`collatz-${sequence[0]}.json`, json, 'application/json;charset=utf-8;')
  }

  const handleShare = async () => {
    if (!sequence.length) {
      return
    }

    const payload = {
      startingNumber: sequence[0],
      totalSteps,
      maxValue,
      averageStepSize,
      chartType,
      theme,
      sequence,
    }

    const encoded = encodeURIComponent(JSON.stringify(payload))
    const shareText = `${window.location.origin}${window.location.pathname}#collatz=${encoded}`

    try {
      await navigator.clipboard.writeText(shareText)
      setShareMessage('Share link copied to clipboard.')
    } catch {
      setShareMessage('Copy failed. You can still export the JSON.')
    }
  }

  const ChartComponent = chartType === 'line' ? Line : Bar

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className={`min-h-screen px-4 py-8 transition-colors duration-300 ${isDark ? 'bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_35%),linear-gradient(135deg,#020817_0%,#0f172a_40%,#111827_100%)] text-slate-100' : 'bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_35%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_40%,#f8fafc_100%)] text-slate-800'}`}>
      <div className="mx-auto max-w-7xl space-y-6">
          <header className="flex flex-col gap-4 pt-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-[0.32em] ${isDark ? 'text-violet-300' : 'text-violet-600'}`}>
                Number Theory Visualizer
              </p>
              <h1 className={`mt-2 text-3xl font-black tracking-tight sm:text-4xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Collatz Conjecture Explorer
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
              className={`control-button inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-all duration-200 ${secondaryButton}`}
            >
              <span>{isDark ? '☀' : '☾'}</span>
              {isDark ? 'Light mode' : 'Dark mode'}
            </button>
          </header>

          <div className={`rounded-2xl border p-3 shadow-sm sm:p-4 ${subtle}`}>
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1">
                <label htmlFor="starting-number" className={`mb-2 block text-sm font-medium ${mutedText}`}>
                  Starting number
                </label>
                <input
                  id="starting-number"
                  type="number"
                  min="1"
                  step="1"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-base outline-none transition focus:ring-2 focus:ring-violet-500/40 ${isDark ? 'border-slate-700 bg-slate-950/60 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'}`}
                  placeholder="Enter a positive integer"
                />
              </div>

              <div className="min-w-[180px]">
                <div className={`mb-2 flex items-center justify-between text-sm ${mutedText}`}>
                  <span>Animation speed</span>
                  <span className={isDark ? 'text-violet-300' : 'text-violet-600'}>{animationDelay} ms</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1500"
                  step="50"
                  value={animationDelay}
                  onChange={(event) => setAnimationDelay(Number(event.target.value))}
                  className="w-full accent-violet-500"
                  aria-label="Animation delay"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button type="submit" form="collatz-form" className={`control-button inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${buttonPrimary}`}>
                ▶ Run
              </button>
              <button type="button" onClick={handlePause} disabled={!sequence.length || isPaused || isComplete} className={`control-button inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${secondaryButton}`}>
                ⏸ Pause
              </button>
              <button type="button" onClick={handleResume} disabled={!isPaused || isComplete} className={`control-button inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${secondaryButton}`}>
                ⏯ Resume
              </button>
              <button type="button" onClick={handleReset} disabled={!sequence.length && !inputValue.length} className={`control-button inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${secondaryButton}`}>
                🔄 Reset
              </button>
              <button type="button" onClick={handleExportCsv} disabled={!sequence.length} className={`control-button inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${secondaryButton}`}>
                ⬇ CSV
              </button>
              <button type="button" onClick={handleExportJson} disabled={!sequence.length} className={`control-button inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${secondaryButton}`}>
                ⬇ JSON
              </button>
              <button type="button" onClick={handleShare} disabled={!sequence.length} className={`control-button inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${secondaryButton}`}>
                ↗ Share
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.7fr]">
            <aside className={`rounded-2xl border p-5 shadow-sm ${subtle}`}>
              <div className="mb-4 flex items-center justify-between">
                <p className={`text-[10px] font-semibold uppercase tracking-[0.26em] ${isDark ? 'text-violet-300' : 'text-violet-600'}`}>About</p>
                <span className={`rounded-full border px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] ${isDark ? 'border-violet-500/30 bg-violet-500/10 text-violet-200' : 'border-violet-200 bg-violet-50 text-violet-700'}`}>
                  {statusLabel}
                </span>
              </div>

              <div id="about-collatz" className={`space-y-4 text-sm leading-6 ${mutedText}`}>
                <p>
                  The Collatz Conjecture, also called the 3n + 1 problem, is a famous mathematical sequence where each number follows a simple rule: if it is even, divide by 2; if it is odd, multiply by 3 and add 1.
                </p>
                <p>
                  This sequence is a cornerstone of elementary number theory and is often used to explore chaotic behavior, mathematical patterns, and computational experimentation in modern mathematics and algorithms.
                </p>
                <p>
                  For every tested positive integer, the sequence appears to eventually reach the repeating cycle 4 → 2 → 1, but no one has proven that this always happens for all integers. That unresolved question is why the Collatz Conjecture remains one of the most famous open problems in mathematics.
                </p>
                <p>
                  Introduced by Lothar Collatz in 1937, the problem became widely studied because its rules are easy to understand yet its behavior can look unpredictable and highly complex. It connects ideas from mathematics, computer science, and dynamical systems.
                </p>
                <p>
                  <a href="https://en.wikipedia.org/wiki/Collatz_conjecture" className={isDark ? 'text-violet-300 underline underline-offset-4 transition-colors hover:text-violet-200' : 'text-violet-700 underline underline-offset-4 transition-colors hover:text-violet-500'}>
                    Learn more about famous conjectures, mathematics history, and the Collatz problem.
                  </a>
                </p>
              </div>
            </aside>

            <section className={`rounded-2xl border p-5 shadow-sm ${subtle}`} aria-labelledby="sequence-overview-title">
              <form id="collatz-form" onSubmit={handleRun} className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 id="sequence-overview-title" className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Sequence overview
                  </h2>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setChartType('line')}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${chartType === 'line' ? (isDark ? 'border-violet-400 bg-violet-500/15 text-violet-200' : 'border-violet-500 bg-violet-50 text-violet-700') : secondaryButton}`}
                    >
                      Line
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartType('bar')}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${chartType === 'bar' ? (isDark ? 'border-violet-400 bg-violet-500/15 text-violet-200' : 'border-violet-500 bg-violet-50 text-violet-700') : secondaryButton}`}
                    >
                      Bar
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-4">
                  <div className={`metric-card ${isDark ? '' : 'light'} rounded-2xl p-4`}>
                    <p className={`text-[10px] uppercase tracking-[0.22em] ${mutedText}`}>Steps</p>
                    <p className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalSteps}</p>
                  </div>
                  <div className={`metric-card ${isDark ? '' : 'light'} rounded-2xl p-4`}>
                    <p className={`text-[10px] uppercase tracking-[0.22em] ${mutedText}`}>Max</p>
                    <p className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{maxValue}</p>
                  </div>
                  <div className={`metric-card ${isDark ? '' : 'light'} rounded-2xl p-4`}>
                    <p className={`text-[10px] uppercase tracking-[0.22em] ${mutedText}`}>Avg</p>
                    <p className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{averageStepSize.toFixed(1)}</p>
                  </div>
                  <div className={`metric-card ${isDark ? '' : 'light'} rounded-2xl p-4`}>
                    <p className={`text-[10px] uppercase tracking-[0.22em] ${mutedText}`}>Current</p>
                    <p className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{visibleSequence[visibleSequence.length - 1] ?? 0}</p>
                  </div>
                </div>

                {errorMessage ? (
                  <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-500">
                    {errorMessage}
                  </p>
                ) : null}

                {shareMessage ? (
                  <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-500">
                    {shareMessage}
                  </p>
                ) : null}

                <div className={`rounded-2xl border p-4 ${soft}`}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Sequence trend</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleAddComparison}
                        disabled={!sequence.length}
                        className={`rounded-full border px-2.5 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${secondaryButton}`}
                      >
                        + Compare
                      </button>
                      <button
                        type="button"
                        onClick={handleResetComparison}
                        disabled={!comparisonRuns.length}
                        className={`rounded-full border px-2.5 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${secondaryButton}`}
                      >
                        Clear overlay
                      </button>
                    </div>
                  </div>
                  <div className="h-80 w-full" aria-live="polite">
                    <figure className="h-full w-full">
                      <div className="sr-only" id="sequence-chart-description">
                        A chart showing the evolving values of the Collatz sequence for the selected starting number.
                      </div>
                      <ChartComponent
                        aria-label="Collatz sequence chart"
                        role="img"
                        data={chartData}
                        options={chartOptions}
                      />
                    </figure>
                  </div>
                </div>
              </form>
            </section>
          </div>

          <section className={`rounded-2xl border p-4 shadow-sm ${subtle}`}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Sequence</h2>
              <span className={`text-sm ${mutedText}`}>{sequence.length ? '4 → 2 → 1 loop' : 'Waiting for input'}</span>
            </div>

            <div className={`scrollbar-thin max-h-72 overflow-y-auto rounded-xl border p-4 ${isDark ? 'border-slate-700 bg-slate-950/60' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex flex-wrap items-center gap-2">
                {visibleSequence.length
                  ? visibleSequence.map((value, index) => {
                      const isCurrent = index === visibleSequence.length - 1

                      return (
                        <div key={`${value}-${index}`} className="flex items-center gap-2 transition-all duration-300">
                          <span
                            className={`sequence-pill inline-flex items-center rounded-full border px-2.5 py-1 text-sm font-medium ${
                              isCurrent
                                ? isDark
                                  ? 'border-violet-400 bg-violet-500/20 text-violet-100 shadow-[0_0_18px_rgba(168,85,247,0.4)]'
                                  : 'border-violet-400 bg-violet-100 text-violet-700 shadow-[0_0_18px_rgba(168,85,247,0.25)]'
                                : isDark
                                  ? 'border-slate-700 bg-slate-800/80 text-slate-200'
                                  : 'border-slate-200 bg-white text-slate-700'
                            }`}
                          >
                            {value}
                          </span>
                          {index < visibleSequence.length - 1 ? <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>→</span> : null}
                        </div>
                      )
                    })
                  : null}
              </div>
            </div>
          </section>

          <footer className="pointer-events-none fixed bottom-6 right-6 z-50 flex items-center gap-3">
            <a
              href="https://github.com/mikegilkim/collatz-conjecture-explorer"
              target="_blank"
              rel="noreferrer"
              aria-label="View the Collatz Conjecture Explorer GitHub repository"
              className={`social-link pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border text-lg font-bold shadow-lg ${isDark ? 'border-violet-500/30 bg-slate-900/80 text-violet-200 hover:border-violet-400 hover:bg-violet-500/10 hover:text-white' : 'border-violet-200 bg-white text-violet-700 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-900'}`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.14c-3.2.7-3.87-1.37-3.87-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.18 1.77 1.18 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.94 10.94 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.26 5.67.41.36.77 1.07.77 2.16v3.2c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
            </a>

            <a
              href="https://www.facebook.com/mikegilkim"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit Mike Gil Kim on Facebook"
              className={`social-link pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border text-lg font-bold shadow-lg ${isDark ? 'border-violet-500/30 bg-slate-900/80 text-violet-200 hover:border-violet-400 hover:bg-violet-500/10 hover:text-white' : 'border-violet-200 bg-white text-violet-700 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-900'}`}
            >
              <span className="transition-transform duration-300 group-hover:scale-110">f</span>
            </a>
          </footer>
      </div>
    </div>
    </>
  )
}

export default App
