import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2c69ff', // Buffer's Blue
        'background-light': '#f5f5f5', // Subtle Gray App Frame
        'background-dark': '#0B1120',
        'card-dark': '#1E293B',
        'text-primary-light': '#1a1a1a', // High-contrast dark gray
        'text-primary-dark': '#F3F4F6',
        'text-secondary-light': '#6B7280',
        'text-secondary-dark': '#9CA3AF',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
export default config
