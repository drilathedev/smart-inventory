/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        g: {
          25:  '#f4fbf6',
          50:  '#e8f5ec',
          100: '#cce8d4',
          200: '#9dd1ad',
          300: '#65b37e',
          400: '#3d9158',
          500: '#2F6B3F',
          600: '#275736',
          700: '#1e432a',
          800: '#163120',
          900: '#0e2116',
        },
        // Warm neutral — not cold gray
        n: {
          0:   '#ffffff',
          25:  '#fdfcfb',
          50:  '#f9f7f5',
          100: '#f2efec',
          200: '#e8e4df',
          300: '#d6d0c9',
          400: '#b0a99f',
          500: '#857d72',
          600: '#635c53',
          700: '#433e37',
          800: '#2c2822',
          900: '#1a1714',
        },
        // Semantic
        danger:  { 50:'#fff1f1', 100:'#ffd7d7', 400:'#f87171', 500:'#ef4444', 600:'#dc2626' },
        warn:    { 50:'#fffbeb', 100:'#fef3c7', 400:'#fbbf24', 500:'#f59e0b', 600:'#d97706' },
        info:    { 50:'#eff6ff', 500:'#3b82f6' },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
      },
      borderRadius: {
        'sm': '6px', DEFAULT: '10px', 'md': '12px',
        'lg': '16px', 'xl': '20px', '2xl': '24px', '3xl': '32px',
      },
      boxShadow: {
        'card':  '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
        'md':    '0 4px 12px rgba(0,0,0,0.07)',
        'lg':    '0 8px 24px rgba(0,0,0,0.09)',
        'xl':    '0 16px 40px rgba(0,0,0,0.10)',
        'float': '0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)',
        'green': '0 4px 16px rgba(47,107,63,0.30)',
        'inner-sm': 'inset 0 1px 2px rgba(0,0,0,0.05)',
      },
      animation: {
        'up':       'up 0.24s cubic-bezier(0.16,1,0.3,1) both',
        'fade':     'fade 0.2s ease both',
        'pop':      'pop 0.2s cubic-bezier(0.34,1.56,0.64,1) both',
        'shimmer':  'shimmer 1.6s ease infinite',
        'pulse-dot':'pulseDot 2s ease-in-out infinite',
        'count-up': 'countUp 0.4s cubic-bezier(0.16,1,0.3,1) both',
      },
      keyframes: {
        up:       { from:{ opacity:'0', transform:'translateY(10px)' }, to:{ opacity:'1', transform:'none' } },
        fade:     { from:{ opacity:'0' }, to:{ opacity:'1' } },
        pop:      { from:{ opacity:'0', transform:'scale(0.94)' }, to:{ opacity:'1', transform:'none' } },
        shimmer:  { '0%':{ backgroundPosition:'-200% 0' }, '100%':{ backgroundPosition:'200% 0' } },
        pulseDot: { '0%,100%':{ opacity:'1', transform:'scale(1)' }, '50%':{ opacity:'0.5', transform:'scale(0.85)' } },
        countUp:  { from:{ opacity:'0', transform:'translateY(4px)' }, to:{ opacity:'1', transform:'none' } },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16,1,0.3,1)',
      },
    },
  },
  plugins: [],
}
