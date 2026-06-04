import type { CreatedGroup, UserLeague } from '~/types/groups'

type ApiListResponse = {
  success: boolean
  data: UserLeague[]
}

type ApiCreateResponse = {
  success: boolean
  data: CreatedGroup
}

export function normalizeUserLeagues(response: ApiListResponse | null): UserLeague[] {
  return response?.data ?? []
}

export function normalizeCreatedGroup(
  response: ApiCreateResponse | null,
): CreatedGroup | null {
  return response?.data ?? null
}

export function fetchErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: { statusMessage?: string; message?: string } }).data
    if (data?.statusMessage) {
      return data.statusMessage
    }
    if (data?.message) {
      return data.message
    }
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Something went wrong. Please try again.'
}
