/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          deep: '#170D24',       // Background utama: #170D24
          blue: '#24102F',       // Background sekunder: #24102F
          surface: '#321442',    // Panel dan kartu: #321442
          card: '#3D1751',       // Varian kartu plum
          border: 'rgba(255, 85, 200, 0.25)', // Border plum/magenta
          locked: '#62536D',     // Level terkunci: #62536D
        },
        cosmic: {
          bgPrimary: '#170D24',
          bgSecondary: '#24102F',
          panel: '#321442',
          purple: '#8D3CC7',
          magenta: '#FF55C8',
          softPink: '#FFB5E8',
          star: '#FFD76A',
          check: '#57E389',
          textPrimary: '#FFF5FF',
          textSecondary: '#C6B2D2',
          locked: '#62536D',
        },
        neon: {
          cyan: '#FF55C8',       // Neon magenta mapped so existing buttons & highlights adopt Cosmic Plum theme
          magenta: '#FF55C8',    // Magenta neon: #FF55C8
          violet: '#8D3CC7',     // Ungu utama: #8D3CC7
          purple: '#8D3CC7',
          pink: '#FFB5E8',       // Pink lembut: #FFB5E8
          gold: '#FFD76A',       // Warna bintang: #FFD76A
          star: '#FFD76A',
          white: '#FFF5FF',      // Teks utama: #FFF5FF
          textSub: '#C6B2D2',    // Teks sekunder: #C6B2D2
          emerald: '#57E389',    // Checklist level selesai: #57E389
          green: '#57E389',
          rose: '#FF3366',
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-magenta': '0 0 15px rgba(255, 85, 200, 0.5), 0 0 30px rgba(255, 85, 200, 0.25)',
        'neon-cyan': '0 0 15px rgba(255, 85, 200, 0.5), 0 0 30px rgba(255, 85, 200, 0.25)',
        'neon-violet': '0 0 15px rgba(141, 60, 199, 0.5), 0 0 30px rgba(141, 60, 199, 0.25)',
        'neon-gold': '0 0 15px rgba(255, 215, 106, 0.5), 0 0 30px rgba(255, 215, 106, 0.25)',
        'card-glow': '0 8px 32px 0 rgba(141, 60, 199, 0.25), 0 0 15px rgba(255, 85, 200, 0.15)',
        'star-glow': '0 0 12px rgba(255, 215, 106, 0.7), 0 0 25px rgba(255, 85, 200, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 30s linear infinite',
        'orbit': 'orbit 20s linear infinite',
        'glow-magenta': 'glowMagenta 2s ease-in-out infinite alternate',
        'star-pulse': 'starPulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
        glowMagenta: {
          '0%': { boxShadow: '0 0 10px rgba(255, 85, 200, 0.4)' },
          '100%': { boxShadow: '0 0 25px rgba(255, 85, 200, 0.8), 0 0 45px rgba(141, 60, 199, 0.4)' },
        },
        starPulse: {
          '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 4px rgba(255, 215, 106, 0.6))' },
          '50%': { transform: 'scale(1.1)', filter: 'drop-shadow(0 0 12px rgba(255, 85, 200, 0.8))' },
        }
      }
    },
  },
  plugins: [],
}
