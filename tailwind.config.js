/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'text-optimi-primary',
    'text-optimi-blue', 
    'text-optimi-green',
    'text-optimi-yellow',
    'text-optimi-gray',
    'bg-optimi-primary',
    'bg-optimi-blue',
    'bg-optimi-green', 
    'bg-optimi-yellow',
    'bg-optimi-gray',
    'border-optimi-primary',
    'border-optimi-blue',
    'border-optimi-green',
    'border-optimi-yellow',
    'border-optimi-gray',
    'hover:bg-optimi-primary/80',
    'hover:bg-optimi-blue/80',
    'hover:bg-optimi-green/80',
    'hover:border-optimi-blue',
    'hover:border-optimi-green',
    'hover:border-optimi-yellow',
    'focus:border-optimi-blue'
  ],
  theme: {
    extend: {
      colors: {
        'optimi-primary': '#283791',
        'optimi-blue': '#0078FF', 
        'optimi-green': '#00C896',
        'optimi-yellow': '#FFDC00',
        'optimi-gray': '#464650',
        'professional': {
          'bg-primary': '#FFFFFF',
          'bg-secondary': '#F9FAFB',
          'bg-tertiary': '#F3F4F6',
          'text-primary': '#111827',
          'text-secondary': '#6B7280',
          'text-tertiary': '#9CA3AF',
        },
      },
    },
  },
  plugins: [],
}