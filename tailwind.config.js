/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        primary: '#29A3CF',
        secondary: '#CEF2FF',
        zerondary: '#00729B',
        disabled: '#8D8D8D',
        vermelho: '#F65A58',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  content: ["./src/**/*.{js,jsx,ts,tsx,html}", "./public/index.html"],
};
