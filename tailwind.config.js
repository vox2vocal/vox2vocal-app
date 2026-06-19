/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        vv: {
          bg: '#050505',
          'bg-subtle': '#0A0505',
          surface: '#121212',
          'surface-raised': '#1A1A1A',
          'surface-warm': '#1A1010',
          border: '#27272A',
          'border-strong': '#3F3F46',
          red: '#DC2626',
          'red-bright': '#EF4444',
          'red-dark': '#991B1B',
          text: '#FFFFFF',
          'text-secondary': '#A1A1AA',
          'text-muted': '#71717A',
          success: '#2EE8B6',
          warning: '#F6BF4F',
          danger: '#F87171',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'Noto Sans KR', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'vv-glow': '0 0 20px rgba(220, 38, 38, 0.4)',
        'vv-glow-subtle': '0 0 15px rgba(220, 38, 38, 0.15)',
      },
      borderRadius: {
        control: '16px',
      },
    },
  },
  plugins: [],
}
