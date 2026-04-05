const preset = require('@kitsunechaos/config/tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [preset],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../packages/tools/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
}
