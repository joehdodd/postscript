import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Map your custom CSS properties to Tailwind classes
        'ps-primary': {
          DEFAULT: 'var(--ps-primary-600)', // Main primary color
          50: 'var(--ps-primary-50)',
          100: 'var(--ps-primary-100)',
          200: 'var(--ps-primary-200)',
          300: 'var(--ps-primary-300)',
          400: 'var(--ps-primary-400)',
          500: 'var(--ps-primary-500)',
          600: 'var(--ps-primary-600)',
          700: 'var(--ps-primary-700)',
          800: 'var(--ps-primary-800)',
          900: 'var(--ps-primary-900)',
        },
        'ps-secondary': {
          DEFAULT: 'var(--ps-secondary-600)', // Main secondary color
          50: 'var(--ps-secondary-50)',
          100: 'var(--ps-secondary-100)',
          200: 'var(--ps-secondary-200)',
          300: 'var(--ps-secondary-300)',
          400: 'var(--ps-secondary-400)',
          500: 'var(--ps-secondary-500)',
          600: 'var(--ps-secondary-600)',
          700: 'var(--ps-secondary-700)',
          800: 'var(--ps-secondary-800)',
          900: 'var(--ps-secondary-900)',
        },
        'ps-accent': {
          DEFAULT: 'var(--ps-accent-500)', // Main accent color
          50: 'var(--ps-accent-50)',
          100: 'var(--ps-accent-100)',
          200: 'var(--ps-accent-200)',
          300: 'var(--ps-accent-300)',
          400: 'var(--ps-accent-400)',
          500: 'var(--ps-accent-500)',
          600: 'var(--ps-accent-600)',
          700: 'var(--ps-accent-700)',
          800: 'var(--ps-accent-800)',
          900: 'var(--ps-accent-900)',
        },
        'ps-neutral': {
          DEFAULT: 'var(--ps-neutral-500)', // Main neutral color
          50: 'var(--ps-neutral-50)',
          100: 'var(--ps-neutral-100)',
          200: 'var(--ps-neutral-200)',
          300: 'var(--ps-neutral-300)',
          400: 'var(--ps-neutral-400)',
          500: 'var(--ps-neutral-500)',
          600: 'var(--ps-neutral-600)',
          700: 'var(--ps-neutral-700)',
          800: 'var(--ps-neutral-800)',
          900: 'var(--ps-neutral-900)',
        },
        'ps-text': {
          primary: 'var(--ps-text-primary)',
          secondary: 'var(--ps-text-secondary)',
        },
      },
      borderColor: {
        'ps': 'var(--ps-border)',
      },
      backgroundColor: {
        'ps-primary': 'var(--ps-bg-primary)',
        'ps-secondary': 'var(--ps-bg-secondary)',
      },
    },
  },
  plugins: [],
}

export default config