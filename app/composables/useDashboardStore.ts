import type { DashboardFixture } from '~/types/DashboardFixture'
import type { FixtureQuestion } from '~/types/questions'
import type { Prediction, PredictionAnswer } from '~/types/predictions'
import type { FixturesApiData } from '~/utils/dashboard'

export function useDashboardStore() {
  const items = useState<DashboardFixture[]>('dashboard-items', () => [])
  const userTotalPoints = useState<number>('dashboard-user-total-points', () => 0)

  function setItems(dashboardItems: DashboardFixture[]) {
    items.value = dashboardItems
  }

  function setDashboardData(data: FixturesApiData) {
    items.value = data.items
    userTotalPoints.value = data.userTotalPoints
  }

  function getQuestionsForFixture(fixtureId: string): FixtureQuestion[] {
    return items.value.find((item) => item.fixture.id === fixtureId)?.questions ?? []
  }

  function getAnswersForFixture(fixtureId: string): PredictionAnswer[] {
    return items.value.find((item) => item.fixture.id === fixtureId)?.answers ?? []
  }

  function setPredictionForFixture(
    fixtureId: string,
    prediction: Prediction,
    answers?: PredictionAnswer[],
  ) {
    items.value = items.value.map((item) =>
      item.fixture.id === fixtureId
        ? {
            ...item,
            prediction,
            answers: answers ?? item.answers,
            fixture: {
              ...item.fixture,
              user_prediction: prediction,
            },
          }
        : item,
    )
  }

  return {
    items,
    userTotalPoints,
    setItems,
    setDashboardData,
    getQuestionsForFixture,
    getAnswersForFixture,
    setPredictionForFixture,
  }
}
