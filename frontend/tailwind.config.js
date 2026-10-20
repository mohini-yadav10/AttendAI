/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── AttendAI Design Tokens ──
        primary: {
          50:  '#f0f7f0',
          100: '#daeeda',
          200: '#b5ddb5',
          300: '#82c382',
          400: '#4fa04f',
          500: '#2d7d2d', // Deep forest green
          600: '#236023',
          700: '#1a4a1a',
          800: '#123512',
          900: '#0a200a',
        },
        sage: {
          50:  '#f4f7f4',
          100: '#e5ede5',
          200: '#cddacd',
          300: '#adc3ad',
          400: '#86a686',
          500: '#6b8f6b', // Sage green
          600: '#537053',
          700: '#3f573f',
          800: '#2c3e2c',
          900: '#1a251a',
        },
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24', // Accent gold/amber
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        background: '#faf9f7', // Warm off-white
        surface: '#ffffff',    // Card surface
        charcoal: {
          50:  '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#3d3d3d', // Dark text
          900: '#262626',
        },
        border: '#e8e5e0', // Subtle neutral border
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.10), 0 2px 6px -2px rgba(0,0,0,0.08)',
        'sidebar': '2px 0 8px 0 rgba(0,0,0,0.08)',
        'modal': '0 20px 60px -10px rgba(0,0,0,0.25)',
        'toast': '0 8px 24px -4px rgba(0,0,0,0.18)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.125rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'slide-down': 'slideDown 0.25s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
    },
  },
  plugins: [],
}
