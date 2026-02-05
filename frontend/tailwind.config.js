/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "../node_modules/@docusaurus/core/lib/client/exports/ComponentList.js",
     "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

