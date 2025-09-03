import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9eaff',
          500: '#2563eb',
          600: '#1d4ed8',
        },
      },
      boxShadow: {
        soft: '0 2px 10px rgba(0,0,0,0.06)'
      }
    },
  },
  plugins: [],
} satisfies Config

