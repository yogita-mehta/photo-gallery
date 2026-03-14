import { useState } from 'react'

/**
 * PhotoCard.jsx
 *
 * Renders a single photo with:
 *  - Lazy-loaded image (loading="lazy" defers off-screen network requests)
 *  - Author name
 *  - Heart toggle button (favourite/unfavourite)
 *
 * Props:
 *   photo        — photo object from the API
 *   isFavourite  — boolean, whether this photo is currently favourited
 *   onToggle     — callback(id) dispatched up to the reducer in Gallery
 */
export default function PhotoCard({ photo, isFavourite, onToggle }) {
  const [imgLoaded, setImgLoaded] = useState(false)

  // Build the Picsum image URL at a fixed display size for performance
  const imgSrc = `https://picsum.photos/id/${photo.id}/600/400`

  return (
    <article className="group relative bg-stone-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300">

      {/* ── Image ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden aspect-[3/2] bg-stone-800">
        {/* Skeleton shimmer shown until the image loads */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 animate-pulse" />
        )}

        <img
          src={imgSrc}
          alt={`Photo by ${photo.author}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`
            w-full h-full object-cover
            group-hover:scale-105 transition-transform duration-500
            ${imgLoaded ? 'opacity-100' : 'opacity-0'}
          `}
        />

        {/* Dark gradient overlay — always visible on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* ── Card Footer ───────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Author */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Coloured avatar circle derived from first letter */}
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold flex items-center justify-center uppercase">
            {photo.author.charAt(0)}
          </span>
          <p className="text-stone-300 text-sm font-medium truncate">{photo.author}</p>
        </div>

        {/* Heart button */}
        <button
          onClick={() => onToggle(photo.id)}
          aria-label={isFavourite ? `Remove ${photo.author} from favourites` : `Add ${photo.author} to favourites`}
          aria-pressed={isFavourite}
          className={`
            flex-shrink-0 p-2 rounded-full transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
            ${isFavourite
              ? 'text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 scale-110'
              : 'text-stone-500 hover:text-rose-400 hover:bg-rose-500/10'
            }
          `}
        >
          {/* Heart SVG — filled when favourite, outlined when not */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5 transition-transform duration-200 hover:scale-125"
            fill={isFavourite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isFavourite ? 0 : 1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>
    </article>
  )
}