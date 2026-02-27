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
                    bg: "#0F172A",
                    primary: "#3B82F6",
                    accent: "#22D3EE",
                    income: "#22C55E",
                    expense: "#EF4444",
                    card: "#1E293B",
                    border: "#334155",
                    textPrimary: "#F1F5F9",
                    textSecondary: "#94A3B8",
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
