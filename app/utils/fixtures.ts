import type { Fixture, FixtureStatus } from '~/types/fixtures'

/** Fixtures are stored and compared in Indian Standard Time */
export const FIXTURE_TIMEZONE = 'Asia/Kolkata'
const IST_OFFSET = '+05:30'

const WALL_CLOCK_RE =
  /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/i

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

type WallClockParts = {
  year: string
  month: string
  day: string
  hour: string
  minute: string
  second: string
}

/** Reads date/time digits from ISO string and treats them as IST wall time. */
export function parseWallClockParts(iso: string): WallClockParts | null {
  const m = iso.trim().match(WALL_CLOCK_RE)
  if (!m) return null

  const year = m[1]
  const month = m[2]
  const day = m[3]
  const hour = m[4]
  const minute = m[5]
  const second = m[6]

  if (!year || !month || !day || !hour || !minute) return null

  return {
    year,
    month,
    day,
    hour,
    minute,
    second: second ?? '00',
  }
}

/** Instant (ms) for kick-off in IST. */
export function parseFixtureMatchTime(iso: string): number {
  const parts = parseWallClockParts(iso)
  if (parts) {
    const { year, month, day, hour, minute, second } = parts
    return new Date(
      `${year}-${month}-${day}T${hour}:${minute}:${second}${IST_OFFSET}`,
    ).getTime()
  }

  return new Date(iso).getTime()
}

function formatHour12(hour24: number): { hour: number; period: 'am' | 'pm' } {
  const period = hour24 >= 12 ? 'pm' : 'am'
  const hour = hour24 % 12 || 12
  return { hour, period }
}

/** Displays the wall-clock time from the DB as IST (e.g. "12 June, 6:00 pm IST"). */
export function formatMatchDate(iso: string): string {
  const parts = parseWallClockParts(iso)
  if (!parts) {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: FIXTURE_TIMEZONE,
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(iso)) + ' IST'
  }

  const monthIndex = Number(parts.month) - 1
  const day = Number(parts.day)
  const hour24 = Number(parts.hour)
  const minute = parts.minute.padStart(2, '0')
  const { hour, period } = formatHour12(hour24)

  const monthName = MONTHS[monthIndex] ?? parts.month
  return `${monthName} ${day}, ${hour}:${minute} ${period} IST`
}

export function formatGroupName(groupName: string | null): string {
  if (!groupName) return '—'
  return groupName.replace(/^Group\s+/i, '').trim() || groupName
}

export function isPredictionLocked(fixture: Fixture): boolean {
  if (fixture.status === 'live' || fixture.status === 'completed' || fixture.status === 'cancelled') {
    return true
  }
  return parseFixtureMatchTime(fixture.match_date) <= Date.now()
}

export function statusLabel(status: FixtureStatus): string {
  const labels: Record<FixtureStatus, string> = {
    scheduled: 'Scheduled',
    live: 'Live',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }
  return labels[status] ?? status
}

export function statusBadgeClass(status: FixtureStatus): string {
  const classes: Record<FixtureStatus, string> = {
    scheduled: 'bg-slate-950 border-slate-800 text-slate-400',
    live: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    completed: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    cancelled: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
  }
  return classes[status] ?? classes.scheduled
}
