/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./demo/templates/**/*.{html,js}",
    "./demo/tailwind/**/*.{html,js,py}",
    "./js/src/**/*.{html,js}",
    "./crispy_formset_modal/templates/crispy_formset_modal/tailwind/**/*.{html,js}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
