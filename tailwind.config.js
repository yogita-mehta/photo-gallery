/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind which files to scan for class names.
  // Only classes found here are included in the final CSS bundle.
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // You can extend the default theme here.
      // e.g. custom colours, fonts, breakpoints.
    },
  },
  plugins: [],
}