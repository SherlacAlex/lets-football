import type { DashboardFixture } from '~/types/DashboardFixture'
import type { FixtureQuestion } from '~/types/questions'
import type { Prediction } from '~/types/predictions'

export function useDashboardStore() {
  const items = useState<DashboardFixture[]>('dashboard-items', () => [])

  function setItems(dashboardItems: DashboardFixture[]) {
    items.value = dashboardItems
  }

  function getQuestionsForFixture(fixtureId: string): FixtureQuestion[] {
    return items.value.find((item) => item.fixture.id === fixtureId)?.questions ?? []
  }

  function setPredictionForFixture(fixtureId: string, prediction: Prediction) {
    items.value = items.value.map((item) =>
      item.fixture.id === fixtureId ? { ...item, prediction } : item,
    )
  }

  return {
    items,
    setItems,
    getQuestionsForFixture,
    setPredictionForFixture,
  }
}
