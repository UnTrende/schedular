/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                heading: ['var(--font-outfit)', 'sans-serif'],
            },
            fontSize: {
                // Fluid typography using clamp
                'fluid-sm': 'clamp(0.8rem, 0.17vw + 0.76rem, 0.89rem)',
                'fluid-base': 'clamp(1rem, 0.34vw + 0.91rem, 1.19rem)',
                'fluid-lg': 'clamp(1.25rem, 0.61vw + 1.1rem, 1.58rem)',
                'fluid-xl': 'clamp(1.56rem, 1vw + 1.31rem, 2.11rem)',
                'fluid-2xl': 'clamp(1.95rem, 1.56vw + 1.56rem, 2.81rem)',
            },
            colors: {
                primary: { // New: Teal
                    DEFAULT: '#14b8a6',
                    foreground: '#ffffff',
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                },
                rose: { // New: Accent Rose
                    50: '#fff1f2',
                    100: '#ffe4e6',
                    200: '#fecdd3',
                    300: '#fda4af',
                    400: '#fb7185',
                    500: '#f43f5e',
                    600: '#e11d48',
                    700: '#be123c',
                    800: '#9f1239',
                    900: '#881337',
                },
                amber: { // New: Accent Amber
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },
                'background-light': '#f8fafc',
                'background-dark': '#020617',
                'card-dark': '#0f172a',
                'text-primary-light': '#0f172a',
                'text-primary-dark': '#f8fafc',
                'text-secondary-light': '#64748b',
                'text-secondary-dark': '#94a3b8',
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "fade-out": {
                    "0%": { opacity: "1", transform: "translateY(0)" },
                    "100%": { opacity: "0", transform: "translateY(10px)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.3s ease-out forwards",
                "fade-out": "fade-out 0.3s ease-out forwards",
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
