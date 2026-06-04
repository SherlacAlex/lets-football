export const apiRoutes = {
    fixtures: "/api/fixtures",
    fixtureQuestions: (fixtureId: string) =>
        `/api/fixtures/${fixtureId}/questions`,
    fixturePrediction: (fixtureId: string) => `/api/predictions/${fixtureId}`,
    createPrediction: "/api/predictions",
    updatePrediction: (predictionId: string) => `/api/predictions/${predictionId}`,
    dashboard: "/api/dashboard",
} as const;
