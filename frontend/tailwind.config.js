/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
  			primary: {
  				DEFAULT: '#FF8A3D',
  				foreground: '#FFFFFF'
  			},
  			secondary: {
  				DEFAULT: '#2A363B',
  				foreground: '#FFFFFF'
  			},
  			accent: {
  				DEFAULT: '#FFF5EB',
  				foreground: '#2A363B'
  			},
  			animation: {
  				'accordion-down': 'accordion-down 0.2s ease-out',
  				'accordion-up': 'accordion-up 0.2s ease-out'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
    },
  },
  plugins: [],
}