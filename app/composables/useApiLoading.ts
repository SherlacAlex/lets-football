const SHOW_DELAY_MS = 150

export function useApiLoading() {
  const activeRequests = useState('api-loading-count', () => 0)
  const isVisible = useState('api-loading-visible', () => false)

  let showTimer: ReturnType<typeof setTimeout> | undefined

  function clearShowTimer() {
    if (showTimer) {
      clearTimeout(showTimer)
      showTimer = undefined
    }
  }

  function start() {
    activeRequests.value += 1

    if (activeRequests.value === 1) {
      clearShowTimer()
      showTimer = setTimeout(() => {
        if (activeRequests.value > 0) {
          isVisible.value = true
        }
        showTimer = undefined
      }, SHOW_DELAY_MS)
    }
  }

  function end() {
    activeRequests.value = Math.max(0, activeRequests.value - 1)

    if (activeRequests.value === 0) {
      clearShowTimer()
      isVisible.value = false
    }
  }

  const isLoading = computed(() => isVisible.value)

  return {
    isLoading,
    start,
    end,
  }
}

export function isTrackedApiRequest(request: RequestInfo): boolean {
  const url = String(request)
  return url.includes('/api/')
}
