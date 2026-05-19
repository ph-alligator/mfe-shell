import preset from '@org/ui/tailwind.preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './node_modules/@org/ui/dist/**/*.{js,mjs}',
  ],
  plugins: [],
};
