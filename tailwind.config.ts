import { type Config } from "tailwindcss";

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'optimi-primary': '#283791',
        'optimi-blue': '#0078FF', 
        'optimi-green': '#00C896',
        'optimi-yellow': '#FFDC00',
        'optimi-gray': '#464650',
      },
    },
  },
} satisfies Config;