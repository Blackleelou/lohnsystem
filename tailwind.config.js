/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/modules/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',

    // ▶︎ shadcn/ui & Headless UI
    'node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}',
    'node_modules/@headlessui/react/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lohn: {
          bgLight: '#f9fafb',
          bgDark:  '#2e3440',
          textLight:   '#111827',
          textDark:    '#eceff4',
          cardLight:   '#ffffff',
          cardDark:    '#3b4252',
          borderLight: '#e5e7eb',
          borderDark:  '#4c566a',
          /** primärer Akzent */
          primary: {
            DEFAULT: '#2563eb',   // lohn-primary
            hover:   '#1e40af',   // lohn-primary-hover
          },
        },
      },
      borderRadius: {
        '2xl': '1.25rem',  // matcht Mock-up
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),   // ◀︎ neu
  ],
};
