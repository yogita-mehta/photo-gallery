import { useState, useEffect } from 'react'

/**
 * useFetchPhotos — Custom hook
 *
 * Encapsulates all data-fetching logic so that Gallery.jsx stays clean
 * and focused on rendering. Any component can reuse this hook without
 * duplicating fetch / error / loading boilerplate.
 *
 * Returns:
 *   photos  — array of photo objects from the API
 *   loading — boolean, true while the request is in flight
 *   error   — string | null, holds an error message on failure
 */
export function useFetchPhotos(url) {
  const [photos, setPhotos]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    // AbortController lets us cancel the fetch if the component unmounts
    // before the request completes — prevents memory-leak / state-update warnings.
    const controller = new AbortController()

    const fetchPhotos = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(url, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        setPhotos(data)
      } catch (err) {
        // Ignore AbortError — it fires when we intentionally cancel the request
        if (err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong while fetching photos.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()

    // Cleanup: abort the in-flight request when the component unmounts
    return () => controller.abort()
  }, [url]) // Re-fetch only if the URL changes

  return { photos, loading, error }
}