# 📸 Luminary — Photo Gallery

A responsive photo gallery built with **React 18 + Vite + Tailwind CSS** .

---

## ✨ Features

| Feature | Implementation |
|---|---|
| Fetch photos on load | `useFetchPhotos` custom hook with AbortController |
| Loading spinner | `Spinner.jsx` component |
| Error handling | Error state with retry button |
| Responsive grid | Tailwind CSS — 1 / 2 / 4 columns |
| Real-time search | `useMemo` filtered list, no extra API calls |
| Toggle favourites | `useReducer` with named action types |
| Persistent favourites | `localStorage` sync via `useEffect` |
| Performance | `useCallback` for stable handler refs, `useMemo` for derived data |

---

## 🚀 Getting Started

### Prerequisites
- Node.js **v18+**
- npm **v9+**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/photo-gallery.git
cd photo-gallery

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build      # outputs to /dist
npm run preview    # serve the production build locally
```

---

## 🗂 Project Structure

```
photo-gallery/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx                  # React entry point
    ├── App.jsx                   # Root component
    ├── index.css                 # Tailwind directives
    ├── components/
    │   ├── Gallery.jsx           # Main view: grid + search + favourites
    │   ├── PhotoCard.jsx         # Individual photo card
    │   └── Spinner.jsx           # Loading indicator
    ├── hooks/
    │   └── useFetchPhotos.js     # Custom hook: fetch + loading + error
    └── reducers/
        └── favouritesReducer.js  # useReducer logic for favourites
```

---

## 🧠 Key Concepts Explained

### `useFetchPhotos` — Custom Hook
Encapsulates `fetch`, `loading`, and `error` state so `Gallery.jsx` stays focused on rendering. Uses `AbortController` to prevent memory leaks when the component unmounts mid-request.

### `useReducer` — Favourites
`useReducer` is used instead of `useState` because toggling favourites requires non-trivial logic (add if absent, remove if present). Named action types (`TOGGLE_FAVOURITE`, `LOAD_FROM_STORAGE`) make the state machine explicit and testable.

### `useMemo` — Filtered Photos
`filteredPhotos` is a *derived* value computed from `photos` + `searchTerm`. `useMemo` ensures this expensive filter runs only when either dependency changes, not on every render.

### `useCallback` — Search Handler & Toggle
`useCallback` memoises event-handler references. Without it, a new function is created every render, causing child components (`PhotoCard`) that receive the handler as a prop to re-render unnecessarily.

---

## 🛠 Tech Stack

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Lorem Picsum API](https://picsum.photos/)

---

## 📜 License

MIT — free to use for educational purposes.
