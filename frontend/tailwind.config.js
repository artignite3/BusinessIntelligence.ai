/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        accenture: {
          purple: '#A100FF',
          darkPurple: '#7E22CE',
          lightPurple: '#F5F0FF',
          borderPurple: '#D8B4FE',
          electric: '#8B5CF6',
        },
      },
      boxShadow: {
        'glow-purple': '0 0 25px rgba(161, 0, 255, 0.25)',
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.25)',
      },
    },
  },
  plugins: [],
}
