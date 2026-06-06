export function buildLeagueJoinPath(inviteCode: string): string {
  return `/leagues/join?code=${encodeURIComponent(inviteCode)}`
}

export function buildLeagueJoinUrl(inviteCode: string): string {
  if (import.meta.client) {
    return `${window.location.origin}${buildLeagueJoinPath(inviteCode)}`
  }
  return buildLeagueJoinPath(inviteCode)
}

export function buildLeagueShareText(leagueName: string, inviteCode: string): string {
  const joinUrl = buildLeagueJoinUrl(inviteCode)

  return `Join me on Let's Football! Predict World Cup matches and compete in our league.

League: ${leagueName}
Invite code: ${inviteCode}

Join here: ${joinUrl}`
}

export async function copyText(text: string): Promise<void> {
  await navigator.clipboard.writeText(text)
}

export async function shareLeagueInvite(
  leagueName: string,
  inviteCode: string,
): Promise<'shared' | 'copied'> {
  const text = buildLeagueShareText(leagueName, inviteCode)
  const url = buildLeagueJoinUrl(inviteCode)

  if (import.meta.client && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: `Join ${leagueName} on Let's Football`,
        text,
        url,
      })
      return 'shared'
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error
      }
    }
  }

  await copyText(text)
  return 'copied'
}
