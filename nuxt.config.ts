const siteDescription =
    "Predict FIFA World Cup 2026 match scores and bonus questions. Join private leagues with friends, earn points for exact scores and correct picks, and climb the live leaderboard.";

export default defineNuxtConfig({
    app: {
        head: {
            htmlAttrs: { lang: "en" },
            charset: "utf-8",
            title: "Let's Football — FIFA World Cup 2026 Prediction Game",
            link: [
                {
                    rel: "icon",
                    type: "image/svg+xml",
                    href: "/fifa-world-cup-2026.svg",
                },
                { rel: "apple-touch-icon", href: "/fifa-world-cup-2026.svg" },
            ],
            meta: [
                {
                    name: "viewport",
                    content:
                        "width=device-width, initial-scale=1, viewport-fit=cover",
                },
                { name: "description", content: siteDescription },
                {
                    name: "keywords",
                    content:
                        "FIFA World Cup 2026, World Cup 2026 predictions, football prediction game, soccer score predictor, World Cup bracket, private prediction league",
                },
                { name: "author", content: "Let's Football" },
                { name: "theme-color", content: "#10b981" },
                { property: "og:type", content: "website" },
                { property: "og:site_name", content: "Let's Football" },
                {
                    property: "og:title",
                    content:
                        "Let's Football — FIFA World Cup 2026 Prediction Game",
                },
                { property: "og:description", content: siteDescription },
                { property: "og:locale", content: "en_US" },
                { name: "twitter:card", content: "summary_large_image" },
                {
                    name: "twitter:title",
                    content:
                        "Let's Football — FIFA World Cup 2026 Prediction Game",
                },
                { name: "twitter:description", content: siteDescription },
            ],
        },
    },
    runtimeConfig: {
        public: {
            siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "",
            supabaseUrl: process.env.SUPABASE_URL,
            supabaseKey: process.env.SUPABASE_KEY,
        },
    },
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    modules: [
        "@nuxtjs/supabase",
        "@nuxt/ui",
        "@nuxt/icon",
        "@vercel/analytics",
    ],
    css: ["~/assets/css/main.css"],
    routeRules: {
        "/": { redirect: "/welcome" },
    },
    supabase: {
        redirectOptions: {
            login: "/login",
            callback: "/confirm",
            exclude: ["/", "/welcome", "/register"],
        },
    },
});
