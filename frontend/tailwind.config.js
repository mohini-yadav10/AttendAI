/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Multimodal BioEnable Theme Palette ──
        // Deep Pine Green (as seen in uploaded mobile UI)
        pine: {
          50:  '#f0f7f5',
          100: '#dcece7',
          200: '#bcdcd3',
          300: '#93c4b7',
          400: '#5a9f8f',
          500: '#327c6d',
          600: '#236155',
          700: '#1b4d44', // Primary brand deep pine
          800: '#163f38',
          900: '#11312c',
        },
        primary: {
          50:  '#f0f7f5',
          100: '#dcece7',
          200: '#bcdcd3',
          300: '#93c4b7',
          400: '#5a9f8f',
          500: '#236155',
          600: '#1b4d44',
          700: '#163f38',
          800: '#11312c',
          900: '#0c231f',
        },
        // Warm Marigold Gold (as seen in uploaded cards & badges)
        marigold: {
          50:  '#fffdf7',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f3a826', // Vibrant gold button / badge
          600: '#d98a12',
          700: '#b46b0a',
          800: '#92520c',
          900: '#78430e',
        },
        gold: {
          50:  '#fffdf7',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f3a826',
          600: '#d98a12',
          700: '#b46b0a',
          800: '#92520c',
          900: '#78430e',
        },
        background: '#f4f7f6', // Soft light sage/mist background
        surface: '#ffffff',
        slate: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(27, 77, 68, 0.08), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 24px -6px rgba(27, 77, 68, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.06)',
        'pill': '0 2px 6px rgba(243, 168, 38, 0.25)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      animation: {
        'pop-in': 'popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'floatGentle 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scan': 'scanLine 2s linear infinite',
      },
      keyframes: {
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 8px rgba(35, 97, 85, 0.4))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 16px rgba(243, 168, 38, 0.6))' },
        },
        scanLine: {
          '0%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0%)' },
        },
      },
    },
  },
  plugins: [],
}
