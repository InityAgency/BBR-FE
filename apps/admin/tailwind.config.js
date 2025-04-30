/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", 
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['InterDisplay', 'sans-serif'],
        display: ['PPEiko', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontSize: '2.5rem',
              fontWeight: '600',
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            h2: {
              fontSize: '2rem',
              fontWeight: '600',
              marginTop: '1.75rem',
              marginBottom: '0.75rem',
            },
            h3: {
              fontSize: '1.75rem',
              fontWeight: '600',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
            },
            h4: {
              fontSize: '1.5rem',
              fontWeight: '600',
              marginTop: '1.25rem',
              marginBottom: '0.5rem',
            },
            // Dodatni stilovi za WordPress elemente
            'figure': {
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            'figcaption': {
              fontSize: '0.875rem',
              fontStyle: 'italic',
              color: 'var(--tw-prose-captions)',
            },
            '.wp-block-quote': {
              borderLeftWidth: '4px',
              borderLeftColor: 'var(--tw-prose-quote-borders)',
              paddingLeft: '1em',
              fontStyle: 'italic',
            },
          },
        },
      },
      colors: {
        primary: {
          100: "#F4E1D2",
          200: "#E9C3A5",
          300: "#DFA678",
          400: "#D4885B",
          500: "#B3804C", // Glavna primarna boja
          600: "#8F663D",
          700: "#6B4C2E",
          800: "#48321F",
          900: "#241910",
        },
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      plugins: [
        // require('@tailwindcss/typography'),
      ],
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-gutter-stable': {
          'scrollbar-gutter': 'stable',
        },
        '.scrollbar-gutter-stable-both': {
          'scrollbar-gutter': 'stable both-edges',
        },
      }
      addUtilities(newUtilities)
    }
  ],
};
