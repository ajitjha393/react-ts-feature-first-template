/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        error: '#ef4444',
        warning: '#f97316',
        success: '#22c55e',
        info: '#3b82f6',
      },
    },
  },
  plugins: [],
};
