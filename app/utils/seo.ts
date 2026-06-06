export const SITE_NAME = "Let's Football"

export const SITE_TAGLINE = 'FIFA World Cup 2026 Prediction Game'

export const DEFAULT_DESCRIPTION =
  'Predict FIFA World Cup 2026 match scores and bonus questions. Join private leagues with friends, earn points for exact scores and correct picks, and climb the live leaderboard.'

export const DEFAULT_KEYWORDS = [
  'FIFA World Cup 2026',
  'World Cup 2026 predictions',
  'football prediction game',
  'soccer score predictor',
  'World Cup bracket',
  'private prediction league',
  'match score prediction',
  'World Cup fantasy',
].join(', ')

export type AppSeoOptions = {
  title?: string
  description?: string
  path?: string
  noIndex?: boolean
  ogType?: 'website' | 'article'
}

export function buildPageTitle(title?: string): string {
  if (!title) {
    return `${SITE_NAME} — ${SITE_TAGLINE}`
  }
  return `${title} | ${SITE_NAME}`
}
