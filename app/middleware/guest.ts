export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()
  const client = useSupabaseClient()

  const { data: { session } } = await client.auth.getSession()
  if (session?.user || user.value) {
    return navigateTo('/welcome')
  }
})
