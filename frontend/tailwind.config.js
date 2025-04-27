/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './index.html',
      './src/**/*.{js,jsx,ts,tsx}'
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50:  '#e6f4ee',
            100: '#c1e6d3',
            500: '#10b981',
            700: '#047857'
          },
          secondary: {
            500: '#6366f1'
          }
        },
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui']
        },
        borderRadius: {
          xl: '1rem',
          '2xl': '1.5rem'
        },
        boxShadow: {
          card: '0 4px 6px rgba(0,0,0,0.1)'
        },
        transitionTimingFunction: {
          inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
      }
    },
    plugins: []
  }