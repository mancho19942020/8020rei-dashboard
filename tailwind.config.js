/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // 8020REI Design System Colors
        main: {
          50: '#F1F6FD',
          100: '#D2E2F8',
          500: '#1665D4',
          700: '#054BAD',
          900: '#14275F',
          950: '#0A132E',
        },
        neutral: {
          100: '#D1D3D6',
          300: '#979BA4',
          500: '#6B7280',
          700: '#4B5566',
        },
      },
    },
  },
  plugins: [],
}
