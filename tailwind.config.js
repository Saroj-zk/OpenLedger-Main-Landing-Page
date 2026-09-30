/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#000000', 2: '#070707', 3: '#0e0e0e' },
        bone: '#f4efe9',
        paper: '#f3f0eb',
        fg: 'rgb(var(--fg-rgb) / <alpha-value>)',
        soft: 'rgb(var(--soft-rgb) / <alpha-value>)',
        mute: '#8f8b86',
        dim: '#5c5955',
        orange: { DEFAULT: '#ff5500', ember: '#ff7a2e', amber: '#ffb07a' },
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        pixel: ['"Geist Pixel Square"', 'Geist', 'monospace'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
        fraunces: ['Fraunces', 'Georgia', 'serif'],
      },
      maxWidth: { page: '1320px' },
    },
  },
  plugins: [],
};
