import type {
  CreatedGroup,
  GroupDetailResponse,
  UserLeague,
} from '~/types/groups'

export function normalizeUserLeagues(
  data: UserLeague[] | { success: boolean; data: UserLeague[] } | null,
): UserLeague[] {
  if (!data) {
    return []
  }
  if (Array.isArray(data)) {
    return data
  }
  return data.data ?? []
}

export function normalizeCreatedGroup(
  response: CreatedGroup | { success: boolean; data: CreatedGroup } | null,
): CreatedGroup | null {
  if (!response) {
    return null
  }
  if ('id' in response && 'invite_code' in response) {
    return response as CreatedGroup
  }
  if ('data' in response && response.data) {
    return response.data
  }
  return null
}

export function normalizeGroupDetail(
  response: GroupDetailResponse | null,
): GroupDetailResponse | null {
  return response ?? null
}

export function fetchErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: { statusMessage?: string; message?: string } }).data
    if (data?.message) {
      return data.message
    }
    if (data?.statusMessage) {
      return data.statusMessage
    }
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Something went wrong. Please try again.'
}
