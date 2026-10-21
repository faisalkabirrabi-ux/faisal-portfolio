export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { ink: '#050505', gold: { DEFAULT: '#D4AF37', soft: '#E8CF7A', deep: '#8A6D1E' } },
      fontFamily: { display: ['"Cormorant Garamond"', '"Hind Siliguri"', 'serif'], body: ['"Hind Siliguri"', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
}
