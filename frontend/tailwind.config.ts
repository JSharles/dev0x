// import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";

// /** @type {import('tailwindcss').Config} */
// const config = {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   darkMode: "class",
//   theme: {
//     extend: {},
//   },
//   plugins: [addVariablesForColors],
// };

// function addVariablesForColors({
//   addBase,
//   theme,
// }: {
//   addBase: (styles: Record<string, Record<string, string>>) => void;
//   theme: (key: string) => Record<string, string>;
// }) {
//   const allColors = flattenColorPalette(theme("colors"));
//   const newVars = Object.fromEntries(
//     Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
//   );

//   addBase({
//     ":root": newVars,
//   });
// }

// export default config;
