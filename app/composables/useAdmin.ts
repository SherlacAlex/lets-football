import { apiRoutes } from '~/utils/api'

export const useAdmin = () => {
    const user = useSupabaseUser()
    const requestFetch = useRequestFetch()
    const isAdmin = useState<boolean | null>('isAdmin', () => null)

    const fetchAdminStatus = async () => {
        if (!user.value) {
            isAdmin.value = false
            return false
        }

        try {
            const data = await requestFetch<{ is_admin: boolean }>(
                apiRoutes.profileAdmin,
            )
            isAdmin.value = data.is_admin === true
        } catch {
            isAdmin.value = false
        }

        return isAdmin.value
    }

    return { isAdmin: readonly(isAdmin), fetchAdminStatus }
}
