/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // remove this to make the fonts back to default
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-green-400',
    'bg-red-400',
    'bg-blue-400',
    'bg-orange-400',
    'bg-teal-400',
    'bg-purple-400',
    'bg-cyan-400',
    'bg-pink-400',  
    'bg-gray-400',
    'bg-lime-400',
    'bg-rose-400' 
  ],
}

