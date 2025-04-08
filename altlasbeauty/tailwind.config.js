module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    safelist: [
      'font-title',
    ],
    theme: {
      extend: {
        fontFamily: {
          title: ['var(--font-lato)', 'sans-serif'],
          body: ['var(--font-crimson)', 'serif'],
        },
      },
    },
    plugins: [],
  }
  