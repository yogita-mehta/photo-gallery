/**
 * favouritesReducer.js
 *
 * useReducer is preferred over useState here because:
 *  - The "toggle" logic is non-trivial (add if missing, remove if present)
 *  - Keeping action types named makes state transitions explicit and testable
 *  - Easier to extend later (e.g. CLEAR_ALL, IMPORT actions)
 *
 * BUG FIX: All IDs are normalised to String() before entering the Set.
 * Reason: Picsum API returns numeric IDs (e.g. 10), but JSON.stringify/parse
 * round-trips through localStorage convert them to strings ("10").
 * Without normalisation, Set.has(10) fails after reload because "10" !== 10.
 */

export const ACTIONS = {
  TOGGLE_FAVOURITE: 'TOGGLE_FAVOURITE',
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
}

/**
 * Initial state — an empty Set of favourite photo IDs (stored as strings).
 */
export const initialState = {
  ids: new Set(),
}

export function favouritesReducer(state, action) {
  switch (action.type) {
    case ACTIONS.TOGGLE_FAVOURITE: {
      const newIds = new Set(state.ids)
      const id = String(action.payload)   // ← normalise: number → string
      if (newIds.has(id)) {
        newIds.delete(id)                 // already favourited → remove
      } else {
        newIds.add(id)                    // not favourited → add
      }
      return { ids: newIds }
    }

    case ACTIONS.LOAD_FROM_STORAGE: {
      // IDs from localStorage are already strings after JSON.parse,
      // but map(String) makes this explicit and safe regardless of source.
      return { ids: new Set(action.payload.map(String)) }
    }

    default:
      return state
  }
}