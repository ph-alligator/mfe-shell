import preset from '@ph-alligator/ui/tailwind.preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './node_modules/@ph-alligator/ui/dist/**/*.{js,mjs}',
  ],
  plugins: [],
};
