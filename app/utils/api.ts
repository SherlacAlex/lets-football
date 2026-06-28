export const apiRoutes = {
    profileAdmin: "/api/profile/admin",
    adminFixtures: "/api/admin/fixtures",
    adminFixture: (fixtureId: string) => `/api/admin/fixtures/${fixtureId}`,
    adminFixtureResult: (fixtureId: string) =>
        `/api/admin/fixtures/${fixtureId}/result`,
    adminFixtureAnswers: (fixtureId: string) =>
        `/api/admin/fixtures/${fixtureId}/answers`,
    adminFixtureCalculate: (fixtureId: string) =>
        `/api/admin/fixtures/${fixtureId}/calculate`,
    fixtures: "/api/fixtures",
    fixtureStatus: (fixtureId: string) => `/api/fixtures/${fixtureId}/status`,
    predictFixture: (fixtureId: string) => `/api/fixtures/${fixtureId}/predict`,
    groups: "/api/groups",
    joinGroup: "/api/groups/join",
    groupDetail: (groupId: string) => `/api/groups/${groupId}`,
    memberPredictions: (groupId: string, userId: string) =>
        `/api/groups/${groupId}/members/${userId}/predictions`,
    memberFixturePrediction: (
        groupId: string,
        userId: string,
        fixtureId: string,
    ) =>
        `/api/groups/${groupId}/members/${userId}/fixtures/${fixtureId}/prediction`,
} as const;
