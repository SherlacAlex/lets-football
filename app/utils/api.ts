export const apiRoutes = {
    fixtures: "/api/fixtures",
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
