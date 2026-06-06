/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        travel: {
          primary: '#3B82F6',
          'primary-hover': '#2563EB',
          accent: '#60A5FA',
          secondary: '#3B82F6',
          dark: '#0F172A',
          muted: '#94A3B8',
          light: '#080C14',
          border: 'rgba(255, 255, 255, 0.08)'
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'travel-card': '16px',
        'travel-btn': '12px',
      },
      boxShadow: {
        'travel-card': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'travel-pop': '0 2px 8px rgba(0, 0, 0, 0.4)',
        'travel-glow': '0 0 40px rgba(59, 130, 246, 0.25)',
      }
    },
  },
  plugins: [],
}
