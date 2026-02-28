/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // LIGHT MODE COLORS
                light: {
                    bg: "#F8FAFC",
                    primary: "#2563EB",
                    accent: "#06B6D4",
                    income: "#16A34A",
                    expense: "#DC2626",
                    card: "#FFFFFF",
                    border: "#E2E8F0",
                    textPrimary: "#1E293B",
                    textSecondary: "#64748B",
                },
                // DARK MODE COLORS
                dark: {
                    bg: "#000000",
                    primary: "#3B82F6",
                    accent: "#22D3EE",
                    income: "#22C55E",
                    expense: "#EF4444",
                    card: "#0a0a0a",
                    border: "#222222",
                    textPrimary: "#F1F5F9",
                    textSecondary: "#A3A3A3",
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
