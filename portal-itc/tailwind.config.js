/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {

    
    // extend: {
    //   colors: {
    //     // transparent: 'transparent',
    //     // current: 'currentColor',
    //     'itccolor': '#651629',
    //   },
    //   keyframes: {
    //     'fade-in-up': {
    //       '0%': {
    //         opacity: '0',
    //         transform: 'translateY(20px)'
    //       },
    //       '100%': {
    //         opacity: '1',
    //         transform: 'translateY(0)'
    //       }
    //     }
    //   },
    //   animation: {
    //     'fade-in-up': 'fade-in-up 1s ease-out',
    //     'fade-in-up-delay-1s': 'fade-in-up 1s ease-out 1s'
    //   }
    // }
    extend: {
      colors: {
        'itccolor': '#651629',
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 1s ease-out',
        'fade-in-up-delay-1s': 'fade-in-up 1s ease-out 1s',
        'fade-in': 'fadeIn 0.5s ease-in-out forwards'
      }
    }
    
  },
  plugins: [],
  darkMode: 'class', // or 'class'
}






