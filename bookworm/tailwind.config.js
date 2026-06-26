/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base:    '#0d1117',
        surface: '#161b22',
        raised:  '#21262d',
        border:  '#30363d',
        'border-light': '#3d444d',
        primary: '#e6edf3',
        secondary: '#c9d1d9',
        muted:   '#8b949e',
        accent:  '#4f8ef7',
        success: '#2ea043',
        danger:  '#f85149',
        warning: '#f0a500',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      borderRadius: {
        sm:  '4px',
        md:  '8px',
        lg:  '10px',
        xl:  '14px',
        '2xl': '18px',
      },
    },
  },
  plugins: [],
};
