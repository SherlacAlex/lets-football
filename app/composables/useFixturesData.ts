import { apiRoutes } from '~/utils/api'
import { parseFixturesApiResponse } from '~/utils/dashboard'

export function useFixturesData() {
  const requestFetch = useRequestFetch()
  const dashboardStore = useDashboardStore()

  const result = useFetch(apiRoutes.fixtures, {
    key: 'dashboard-fixtures',
    $fetch: requestFetch as typeof $fetch,
    transform: (data) => parseFixturesApiResponse(data),
  })

  watch(
    result.data,
    (data) => {
      if (data) {
        dashboardStore.setDashboardData(data)
      }
    },
    { immediate: true },
  )

  return result
}
