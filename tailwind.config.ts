import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        disp: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      colors: {
        neo: { 50:'#ecfdf5', 100:'#d1fae5', 200:'#a7f3d0', 300:'#6ee7b7', 400:'#34d399', 500:'#00ff88', 600:'#00d96b', 700:'#00a352', 800:'#007a3d', 900:'#005a2c' },
        ink: { 50:'#f5f5f5', 100:'#e5e5e5', 200:'#d4d4d4', 300:'#a3a3a3', 400:'#737373', 500:'#525252', 600:'#404040', 700:'#262626', 800:'#171717', 900:'#0a0a0a', 950:'#050505' },
        amber: { 400:'#fbbf24', 500:'#f59e0b' },
        pink: { 400:'#f472b6', 500:'#ec4899' }
      }
    }
  },
  plugins: [],
};
export default config;
