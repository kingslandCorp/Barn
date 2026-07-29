import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF5EA',
          dark: '#F1E7D2',
        },
        ink: '#2E2A22',
        coast: {
          DEFAULT: '#3E6E80',
          light: '#7FA8B3',
          dark: '#294B58',
        },
        sage: {
          DEFAULT: '#8C9B7C',
          dark: '#66735A',
          light: '#B9C4AC',
        },
        stone: {
          DEFAULT: '#A79C8C',
          light: '#D9D0C1',
        },
        sand: {
          DEFAULT: '#E4D3B0',
          light: '#F0E4C8',
        },
        gold: {
          DEFAULT: '#D9A441',
          deep: '#C6763A',
          light: '#EFC978',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'ui-serif', 'Georgia', 'serif'],
        body: ['var(--font-work-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(46, 42, 34, 0.08)',
        card: '0 4px 20px rgba(46, 42, 34, 0.06)',
      },
      maxWidth: {
        content: '1400px',
      },
    },
  },
  plugins: [],
};

export default config;
