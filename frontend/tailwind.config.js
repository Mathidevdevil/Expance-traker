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
                primary: "#0f172a", // Dark blue/slate
                secondary: "#334155", // Slate
                accent: "#3b82f6", // Blue
                success: "#10b981", // Green
                danger: "#ef4444", // Red
                warning: "#f59e0b", // Amber
                background: "#f8fafc", // Light gray
                surface: "#ffffff", // White
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
