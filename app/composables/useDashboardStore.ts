import type { DashboardFixture } from '~/types/DashboardFixture'
import type { FixtureQuestion } from '~/types/questions'
import type { Prediction, PredictionAnswer } from '~/types/predictions'

export function useDashboardStore() {
  const items = useState<DashboardFixture[]>('dashboard-items', () => [])

  function setItems(dashboardItems: DashboardFixture[]) {
    items.value = dashboardItems
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
    setItems,
    getQuestionsForFixture,
    getAnswersForFixture,
    setPredictionForFixture,
  }
}
