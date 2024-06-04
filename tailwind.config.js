/** @type {import('tailwindcss').Config} */

// NOTE: See also: https://tailwindcss.com/docs

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      // xs: '320px',
      sm: '640px', // => @media (min-width: 640px) { ... }
      md: '768px', // => @media (min-width: 768px) { ... }
      lg: '1024px', // => @media (min-width: 1024px) { ... }
      xl: '1280px', // => @media (min-width: 1280px) { ... }
      '2xl': '1536px', // => @media (min-width: 1536px) { ... }
    },
    fontSize: {
      sm: '0.8rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
    },
    // NOTE: See also https://tailwindcss.com/docs/border-radius
    borderRadius: {
      'none': '0',
      'sm': '5px',
      DEFAULT: '10px',
      'md': '10px',
      'lg': '20px',
      'full': '9999px',
      'large': '30px',
    },
    extend: {
      // maxWidth: {
      //   'sm': '640px',
      // },
      // width: {
      //   '1000': '1000px',
      // },
      fontSize: {
        xs: '0.6rem',
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'white': '#ffffff',
        'spBlueMain': '#3882c4',
        'spBlue2': '#6ea0eb',
        'spGreenDark': '#168f48',
        'spGreen': '#71bc81',
        'spRed': '#c84f4f',
      },
    },
  },
  plugins: [],
}
