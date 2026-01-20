/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Scan the shared UI package for classes
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      // Ensure specific typography plugin styles match the dark theme
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.zinc.300'),
            a: {
              color: theme('colors.cyan.400'),
              '&:hover': {
                color: theme('colors.cyan.300'),
              },
            },
            h1: { color: theme('colors.zinc.100') },
            h2: { color: theme('colors.zinc.100') },
            h3: { color: theme('colors.zinc.200') },
            strong: { color: theme('colors.zinc.200') },
            code: {
              color: theme('colors.cyan.300'),
              backgroundColor: theme('colors.cyan.950'),
              borderRadius: theme('borderRadius.DEFAULT'),
              padding: '0.125rem 0.375rem',
            },
          },
        },
      }),
      // Animations required by the shared UI package
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        checkDraw: {
          to: { strokeDashoffset: '0' }
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        checkDraw: 'checkDraw 0.3s ease-out forwards',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Documentation app usually needs this
  ],
}