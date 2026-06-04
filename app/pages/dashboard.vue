<template>
  <div class="space-y-8">
    <!-- Match Prediction Dashboard -->
    <div>
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl font-extrabold text-white">World Cup Predictions</h2>
          <p class="text-slate-400 text-xs mt-1">Enter your score predictions below. Exact score = 3pts, Correct outcome
            = 1pt.</p>
        </div>
        <div
          class="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-400">
          <UIcon name="i-heroicons-clock" class="w-4 h-4 text-emerald-400" />
          <span>Predictions lock at kick-off</span>
        </div>
      </div>

      <!-- Action Toast Banner -->
      <div v-if="toastMessage"
        :class="[toastType === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400', 'p-4 mb-6 rounded-2xl border text-sm flex items-center justify-between transition-all duration-300']">
        <div class="flex items-center space-x-2">
          <UIcon :name="toastType === 'success' ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-triangle'"
            class="w-5 h-5" />
          <span>{{ toastMessage }}</span>
        </div>
        <button @click="toastMessage = ''" class="hover:opacity-80">
          <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Match Cards -->
        <div v-for="match in matches" :key="match.id"
          class="group bg-slate-900/40 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 backdrop-blur-md transition-all duration-300">
          <div class="flex justify-between items-center text-xs text-slate-500 mb-4">
            <span>{{ match.date }} &bull; Group {{ match.group }}</span>
            <span class="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">{{ match.venue
              }}</span>
          </div>

          <!-- Teams and Scores -->
          <div class="flex items-center justify-between gap-4 py-2">
            <!-- Home Team -->
            <div
              class="flex-1 flex flex-col items-center sm:flex-row sm:items-center sm:space-x-4 text-center sm:text-left">
              <span class="text-3xl sm:text-4xl">{{ match.homeFlag }}</span>
              <span class="font-bold text-slate-200 mt-2 sm:mt-0 text-sm sm:text-base">{{ match.homeTeam }}</span>
            </div>

            <!-- Score Inputs -->
            <div class="flex items-center space-x-2">
              <input type="number" min="0" v-model="predictions[match.id].homeScore" placeholder="0"
                class="w-12 h-12 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-center font-bold text-lg text-white focus:outline-none transition-all duration-200" />
              <span class="text-slate-600 font-bold">-</span>
              <input type="number" min="0" v-model="predictions[match.id].awayScore" placeholder="0"
                class="w-12 h-12 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-center font-bold text-lg text-white focus:outline-none transition-all duration-200" />
            </div>

            <!-- Away Team -->
            <div
              class="flex-1 flex flex-col items-center sm:flex-row-reverse sm:items-center sm:space-x-reverse sm:space-x-4 text-center sm:text-right">
              <span class="text-3xl sm:text-4xl">{{ match.awayFlag }}</span>
              <span class="font-bold text-slate-200 mt-2 sm:mt-0 text-sm sm:text-base">{{ match.awayTeam }}</span>
            </div>
          </div>

          <!-- Save Button for this Match -->
          <div class="mt-6 flex justify-end">
            <button @click="savePrediction(match.id)"
              class="relative overflow-hidden px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold rounded-xl active:scale-95 transition-all duration-200">
              Save Prediction
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'auth'
})

const user = useSupabaseUser()
const client = useSupabaseClient()

// Redirect to login if not authenticated
onMounted(() => {
  if (!user.value) {
    navigateTo('/login')
  }
})

// Mock Matches
const matches = ref([
  { id: 'm1', homeTeam: 'Brazil', homeFlag: '🇧🇷', awayTeam: 'France', awayFlag: '🇫🇷', group: 'A', date: 'June 12, 18:00', venue: 'Lusail Stadium' },
  { id: 'm2', homeTeam: 'Argentina', homeFlag: '🇦🇷', awayTeam: 'Germany', awayFlag: '🇩🇪', group: 'C', date: 'June 13, 21:00', venue: 'Al Bayt Stadium' },
  { id: 'm3', homeTeam: 'England', homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', awayTeam: 'Spain', awayFlag: '🇪🇸', group: 'B', date: 'June 14, 15:00', venue: 'Education City' },
  { id: 'm4', homeTeam: 'Portugal', homeFlag: '🇵🇹', awayTeam: 'Italy', awayFlag: '🇮🇹', group: 'D', date: 'June 15, 18:00', venue: 'Al Janoub Stadium' }
])

// Predictions state
const predictions = ref<Record<string, { homeScore: number | null, awayScore: number | null }>>({
  m1: { homeScore: null, awayScore: null },
  m2: { homeScore: null, awayScore: null },
  m3: { homeScore: null, awayScore: null },
  m4: { homeScore: null, awayScore: null }
})

const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

// Load existing predictions from localStorage on mount
onMounted(() => {
  const saved = localStorage.getItem('world_cup_predictions')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      Object.keys(parsed).forEach(key => {
        if (predictions.value[key]) {
          predictions.value[key] = parsed[key]
        }
      })
    } catch (e) {
      console.error('Error loading local predictions', e)
    }
  }
})

// Save prediction logic
const savePrediction = async (matchId: string) => {
  const pred = predictions.value[matchId]
  if (pred.homeScore === null || pred.awayScore === null) {
    toastMessage.value = 'Please input scores for both teams.'
    toastType.value = 'error'
    return
  }

  try {
    // Attempt saving to Supabase predictions table
    const { error } = await client
      .from('predictions')
      .upsert({
        user_id: user.value?.id,
        match_id: matchId,
        home_score: pred.homeScore,
        away_score: pred.awayScore,
        updated_at: new Date()
      }, { onConflict: 'user_id,match_id' })

    if (error) {
      // If table does not exist or database is not fully configured, fall back to local storage
      console.warn('Supabase DB error, using LocalStorage fallback:', error.message)
      saveToLocalStorage(matchId, pred)
      toastMessage.value = `Prediction for ${matches.value.find(m => m.id === matchId)?.homeTeam} vs ${matches.value.find(m => m.id === matchId)?.awayTeam} saved locally!`
      toastType.value = 'success'
    } else {
      toastMessage.value = `Prediction for ${matches.value.find(m => m.id === matchId)?.homeTeam} vs ${matches.value.find(m => m.id === matchId)?.awayTeam} saved to database!`
      toastType.value = 'success'
    }
  } catch (err) {
    // Catch block for network or client errors, fallback to local storage
    saveToLocalStorage(matchId, pred)
    toastMessage.value = `Prediction for ${matches.value.find(m => m.id === matchId)?.homeTeam} vs ${matches.value.find(m => m.id === matchId)?.awayTeam} saved locally!`
    toastType.value = 'success'
  }
}

const saveToLocalStorage = (matchId: string, pred: any) => {
  const current = localStorage.getItem('world_cup_predictions')
  let parsed = {}
  if (current) {
    try {
      parsed = JSON.parse(current)
    } catch (e) { }
  }
  parsed[matchId] = pred
  localStorage.setItem('world_cup_predictions', JSON.stringify(parsed))
}

</script>