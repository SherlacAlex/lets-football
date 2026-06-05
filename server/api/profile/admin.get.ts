import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

    try {
        const is_admin = await getProfileAdminStatus(supabase, user.sub)
        return { is_admin }
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: error instanceof Error ? error.message : 'Failed to load profile',
        })
    }
})
