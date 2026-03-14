/**
 * Spinner.jsx
 * A simple accessible loading indicator built with Tailwind CSS only.
 * role="status" + sr-only text keeps it screen-reader friendly.
 */
export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20" role="status">
      {/* Outer ring */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-stone-200" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 animate-spin" />
      </div>
      <p className="text-stone-400 text-sm tracking-widest uppercase font-light animate-pulse">
        Loading Photos…
      </p>
      <span className="sr-only">Loading…</span>
    </div>
  )
}