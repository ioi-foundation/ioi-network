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
      // Animations required by the shared UI package (Skeleton & UIComponents)
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        checkDraw: {
          to: { strokeDashoffset: '0' }
        },
        // Standard spin/pulse are included by default, but we can customize if needed
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        // Used in SuccessCheck component
        checkDraw: 'checkDraw 0.3s ease-out forwards', 
      }
    },
  },
  plugins: [],
}