import Gallery from './components/Gallery'

/**
 * App.jsx — root component.
 * Kept deliberately thin: just renders <Gallery />.
 * Any future global providers (context, router) would wrap here.
 */
export default function App() {
  return <Gallery />
}