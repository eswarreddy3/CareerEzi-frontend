import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-syne)', 'serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        navy: {
          900: '#0A0F1E',
          800: '#0D1224',
          700: '#1A1F35',
        },
        teal: {
          DEFAULT: '#00D4C8',
          dark: '#00A89F',
        },
        amber: {
          DEFAULT: '#F59E0B',
        },
      },
      boxShadow: {
        'teal-glow': '0 0 20px rgba(0, 212, 200, 0.3)',
        'teal-glow-lg': '0 0 40px rgba(0, 212, 200, 0.4)',
      },
    },
  },
  plugins: [],
}

export default config
