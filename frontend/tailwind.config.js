/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ffffff',
          glow: 'rgba(255, 255, 255, 0.15)',
          hover: '#f4f4f5',
          light: 'rgba(255, 255, 255, 0.1)',
          gradientStart: '#ffffff',
          gradientEnd: '#a1a1aa',
        },
        accent: {
          DEFAULT: '#a1a1aa',
          hover: '#71717a',
          glow: 'rgba(161, 161, 170, 0.15)',
          light: 'rgba(161, 161, 170, 0.1)',
        },
        secondary: '#e4e4e7',
        supporting: '#ffffff',
        background: '#000000',
        surface: '#09090b',
        'surface-dark': '#000000',
        'on-surface': '#ffffff',
        'on-surface-variant': '#a1a1aa',
        travel: {
          primary: '#ffffff',
          'primary-hover': '#f4f4f5',
          accent: '#a1a1aa',
          secondary: '#ffffff',
          dark: '#09090b',
          muted: '#71717a',
          light: '#000000',
          border: 'rgba(255, 255, 255, 0.1)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'travel-card': '16px',
        'travel-btn': '12px',
      },
      boxShadow: {
        'travel-card': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'travel-pop': '0 2px 8px rgba(0, 0, 0, 0.4)',
        'travel-glow': '0 0 40px rgba(255, 255, 255, 0.15)',
      }
    },
  },
  plugins: [],
};
