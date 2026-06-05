import type { AdminDashboardFixture, AdminFixtureQuestion } from '~/types/AdminDashboardFixture'

export function useAdminDashboardStore() {
  const items = useState<AdminDashboardFixture[]>('admin-dashboard-items', () => [])

  function setItems(dashboardItems: AdminDashboardFixture[]) {
    items.value = dashboardItems
  }

  function getQuestionsForFixture(fixtureId: string): AdminFixtureQuestion[] {
    return items.value.find((item) => item.fixture.id === fixtureId)?.questions ?? []
  }

  function setResultForFixture(
    fixtureId: string,
    homeScore: number,
    awayScore: number,
    answers?: { question_template_id: string; correct_answer: string }[],
  ) {
    items.value = items.value.map((item) => {
      if (item.fixture.id !== fixtureId) {
        return item
      }

      const updatedQuestions = answers
        ? item.questions.map((question) => {
            const saved = answers.find(
              (answer) => answer.question_template_id === question.question_template.id,
            )
            return saved
              ? { ...question, correct_answer: saved.correct_answer }
              : question
          })
        : item.questions

      return {
        ...item,
        actual_result: { home_score: homeScore, away_score: awayScore },
        questions: updatedQuestions,
        fixture: {
          ...item.fixture,
          home_score: homeScore,
          away_score: awayScore,
          status: 'completed',
          can_edit_result: true,
        },
      }
    })
  }

  return {
    items,
    setItems,
    getQuestionsForFixture,
    setResultForFixture,
  }
}
