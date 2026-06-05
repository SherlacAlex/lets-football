import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const supabase = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

    // Get groups where user is a member
    const { data: memberships, error: groupsError } = await supabase
        .from('group_members')
        .select(`group_id, groups:group_id (id, name, invite_code, created_at)`)
        .eq('user_id', user.sub)

    if (groupsError) throw createError({ statusCode: 500, message: groupsError.message })

    const groups = memberships.map(m => m.groups)

    // For each group, get ranking info via RPC (returns all members with points)
    const enriched = await Promise.all(groups.map(async (group) => {
        const { data: ranking, error: rankError } = await supabase
            .rpc('get_group_ranking', { group_id_param: group.id })

        if (rankError) throw createError({ statusCode: 500, message: rankError.message })

        const myEntry = ranking?.find(r => r.user_id === user.sub)
        const myRank = ranking ? ranking.findIndex(r => r.user_id === user.sub) + 1 : null

        return {
            ...group,
            my_total_points: myEntry?.total_points || 0,
            my_rank: myRank,
            member_count: ranking?.length || 0
        }
    }))

    return enriched
})