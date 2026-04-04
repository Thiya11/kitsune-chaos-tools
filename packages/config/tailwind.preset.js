/** @type {import('tailwindcss').Config} */
const preset = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Near-black site background palette (matches kitsunechaos.com)
        site: {
          bg:      '#0a0a0a',
          card:    '#111111',
          border:  '#222222',
          hover:   '#191919',
          muted:   '#888888',
          subtle:  '#555555',
        },
        // Accent: warm yellow (the ☀ from kitsunechaos nav)
        accent: {
          DEFAULT: '#f0c040',
          hover:   '#f5d060',
          muted:   'rgba(240,192,64,0.12)',
          border:  'rgba(240,192,64,0.25)',
        },
        // Live / status green
        live: {
          DEFAULT: '#22c55e',
          muted:   'rgba(34,197,94,0.12)',
          border:  'rgba(34,197,94,0.3)',
        },
        // Keep brand alias pointing to accent for minimal code churn
        brand: {
          50:  '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#f0c040',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in':  'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        ping:       'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        // Diagonal stripe texture used on cards (matches kitsunechaos cards)
        'card-texture': `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 4px,
          rgba(255,255,255,0.025) 4px,
          rgba(255,255,255,0.025) 5px
        )`,
      },
    },
  },
  plugins: [],
}

module.exports = preset
