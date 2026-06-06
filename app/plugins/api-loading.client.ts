import { isTrackedApiRequest, useApiLoading } from '~/composables/useApiLoading'

export default defineNuxtPlugin({
  name: 'api-loading',
  enforce: 'post',
  setup(nuxtApp) {
    const { start, end } = useApiLoading()

    const wrappedFetch = $fetch.create({
      onRequest({ request }) {
        if (isTrackedApiRequest(request)) {
          start()
        }
      },
      onRequestError({ request }) {
        if (isTrackedApiRequest(request)) {
          end()
        }
      },
      onResponse({ request }) {
        if (isTrackedApiRequest(request)) {
          end()
        }
      },
      onResponseError({ request }) {
        if (isTrackedApiRequest(request)) {
          end()
        }
      },
    })

    globalThis.$fetch = wrappedFetch as typeof $fetch
    nuxtApp.$fetch = wrappedFetch as typeof $fetch
  },
})
