import type { Ref } from 'vue'
import type { LeagueData } from '~/types/groups'

export function useLeagueStore() {
  const leaguesMap = useState<Record<string, LeagueData>>('leagues-map', () => ({}))

  /** Set or replace a single league record */
  function setLeague(league: LeagueData) {
    leaguesMap.value = { ...leaguesMap.value, [league.id]: league }
  }

  /** Bulk replace all leagues – useful after the initial fetch */
  function setLeagues(leagues: LeagueData[]) {
    const map: Record<string, LeagueData> = {}
    leagues.forEach((lg) => {
      map[lg.id] = lg
    })
    leaguesMap.value = map
  }

  /** Retrieve a league by its id */
  function getLeague(id: string): LeagueData | undefined {
    return leaguesMap.value[id]
  }

  /** Return an array of all stored leagues */
  function getAllLeagues(): LeagueData[] {
    return Object.values(leaguesMap.value)
  }

  return {
    leaguesMap: leaguesMap as Ref<Record<string, LeagueData>>,
    setLeague,
    setLeagues,
    getLeague,
    getAllLeagues,
  }
}
