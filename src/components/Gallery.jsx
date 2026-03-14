import { useReducer, useEffect, useCallback, useMemo, useState } from 'react'
import { useFetchPhotos } from '../hooks/useFetchPhotos'
import { favouritesReducer, ACTIONS } from '../reducers/favouritesReducer'
import PhotoCard from './PhotoCard'
import Spinner from './Spinner'

const API_URL = 'https://picsum.photos/v2/list?limit=30'
const STORAGE_KEY = 'photo-gallery-favourites'

/**
 * Read localStorage ONCE and build the real initial state.
 * This runs synchronously before the first render — no useEffect needed,
 * no race condition, no StrictMode double-invoke problem.
 */
function getInitialState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const ids = JSON.parse(stored)
      return { ids: new Set(ids.map(String)) }
    }
  } catch {
    // corrupted storage — fall through to empty state
  }
  return { ids: new Set() }
}

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos(API_URL)

  /**
   * Pass getInitialState as a lazy initializer function (not its return value).
   * React calls it once on mount to get the starting state.
   * This is the correct pattern for reading localStorage synchronously.
   */
  const [state, dispatch] = useReducer(favouritesReducer, undefined, getInitialState)

  // ── Save to localStorage whenever favourites change ───────────
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.ids]))
    } catch {
      // ignore quota errors
    }
  }, [state.ids])

  // ── Search ────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value)
  }, [])

  const filteredPhotos = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return photos
    return photos.filter(photo =>
      photo.author.toLowerCase().includes(term)
    )
  }, [photos, searchTerm])

  const handleToggleFavourite = useCallback((id) => {
    dispatch({ type: ACTIONS.TOGGLE_FAVOURITE, payload: id })
  }, [])

  const favouriteCount = state.ids.size

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">

      {/* ── Header ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">

          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-stone-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18A1.75 1.75 0 0022.75 18.5V5.75A1.75 1.75 0 0021 4H3A1.75 1.75 0 001.25 5.75v12.75A1.75 1.75 0 003 20.25z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-stone-100 leading-none">Luminary</h1>
              <p className="text-xs text-stone-500 mt-0.5">Photo Gallery</p>
            </div>
            {favouriteCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 text-xs font-medium">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {favouriteCount}
              </span>
            )}
          </div>

          <div className="relative w-full sm:w-72">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by author…"
              aria-label="Filter photos by author name"
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-200 placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors duration-200"
            />
          </div>
        </div>
      </header>

      {/* ── Main ──────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {loading && <Spinner />}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-stone-200 font-semibold mb-1">Failed to load photos</h2>
              <p className="text-stone-400 text-sm">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-amber-500 text-stone-950 text-sm font-semibold hover:bg-amber-400 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && filteredPhotos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-full bg-stone-800 flex items-center justify-center">
              <svg className="w-7 h-7 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="text-stone-400 text-sm">
              No photos found for <span className="text-amber-400 font-medium">"{searchTerm}"</span>
            </p>
          </div>
        )}

        {!loading && !error && filteredPhotos.length > 0 && (
          <>
            <p className="text-stone-500 text-xs mb-5 uppercase tracking-widest font-light">
              {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
              {searchTerm && ` for "${searchTerm}"`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredPhotos.map(photo => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  isFavourite={state.ids.has(String(photo.id))}
                  onToggle={handleToggleFavourite}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-stone-800/60 mt-12 py-6 text-center text-stone-600 text-xs">
        Photos sourced from{' '}
        <a href="https://picsum.photos" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-400 transition-colors">
          Lorem Picsum
        </a>
        {' '}· Built with React + Vite + Tailwind CSS
      </footer>
    </div>
  )
}