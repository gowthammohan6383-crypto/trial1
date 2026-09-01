/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#070B09',
        'bioteal-dark': '#061E1A',
        'bioteal-light': '#0D3832',
        lime: {
          accent: '#B8FF4D',
          hover: '#A3FF2E',
          glow: 'rgba(184, 255, 77, 0.4)'
        },
        ultraviolet: {
          mist: '#5B3A8E',
          glow: 'rgba(91, 58, 142, 0.5)'
        },
        ivory: '#F3F5EC',
        card: 'rgba(6, 30, 26, 0.6)'
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-lime': '0 0 25px rgba(184, 255, 77, 0.35)',
        'glow-teal': '0 0 35px rgba(6, 30, 26, 0.8)',
        'glow-purple': '0 0 30px rgba(91, 58, 142, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scan 3s linear infinite',
        'orb-float': 'orbFloat 6s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        },
        orbFloat: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-15px) scale(1.05)' }
        }
      }
    },
  },
  plugins: [],
}
