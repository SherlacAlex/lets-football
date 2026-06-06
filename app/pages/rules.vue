<template>
  <div class="space-y-8">
    <!-- Page header -->
    <div
      class="relative overflow-hidden bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
      <div class="absolute -right-16 -top-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl"></div>
      <div class="relative z-10">
        <div
          class="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-emerald-400 uppercase mb-4">
          <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
          <span>How to play</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white">Prediction Rules</h1>
        <p class="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
          For every match you answer four questions. One score prediction is always included; three bonus questions are
          chosen at random from the pool below.
        </p>
      </div>
    </div>

    <!-- Per-match overview -->
    <div class="grid grid-cols-3 gap-2 sm:gap-4">
      <div class="bg-slate-900/40 border border-slate-800/80 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center">
        <p class="text-2xl sm:text-3xl font-extrabold text-emerald-400">4</p>
        <p class="text-[10px] sm:text-xs text-slate-500 mt-1 uppercase tracking-wide font-semibold leading-snug">Questions per match</p>
      </div>
      <div class="bg-slate-900/40 border border-emerald-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center">
        <p class="text-2xl sm:text-3xl font-extrabold text-emerald-400">5</p>
        <p class="text-[10px] sm:text-xs text-slate-500 mt-1 uppercase tracking-wide font-semibold leading-snug">Points — exact score</p>
      </div>
      <div class="bg-slate-900/40 border border-indigo-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center">
        <p class="text-2xl sm:text-3xl font-extrabold text-indigo-400">1</p>
        <p class="text-[10px] sm:text-xs text-slate-500 mt-1 uppercase tracking-wide font-semibold leading-snug">Point each — bonus</p>
      </div>
    </div>

    <!-- Required: score prediction -->
    <section class="space-y-4">
      <div class="flex items-center gap-3">
        <h2 class="text-lg font-extrabold text-white">Required question</h2>
        <span
          class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Every match
        </span>
      </div>

      <div
        class="group relative bg-slate-900/40 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md transition-all duration-300">
        <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full"></div>
        <div class="relative z-10 flex flex-col sm:flex-row sm:items-start gap-5">
          <div
            class="w-12 h-12 shrink-0 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
            <UIcon name="i-heroicons-calculator" class="w-6 h-6" />
          </div>
          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-3 mb-2">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Question 1</span>
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Up to 5 points
              </span>
            </div>
            <h3 class="text-xl font-bold text-slate-100">Predict the score of the match</h3>
            <p class="text-slate-400 text-sm mt-2 leading-relaxed">
              Enter the full-time score for both teams. This question is included on every match and is worth the most
              points.
            </p>
            <ul class="mt-4 space-y-2.5 text-sm">
              <li class="flex items-start gap-3 text-slate-300">
                <span class="shrink-0 font-bold text-emerald-400 tabular-nums">5 pts</span>
                <span>Exact score — predicted score match the final score.</span>
              </li>
              <li class="flex items-start gap-3 text-slate-300">
                <span class="shrink-0 font-bold text-emerald-400 tabular-nums">2 pts</span>
                <span>Correct result — the right winner or draw, but the scoreline is wrong.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Bonus pool -->
    <section class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-lg font-extrabold text-white">Bonus question pool</h2>
          <p class="text-slate-400 text-sm mt-1">
            Three questions are randomly selected from this list for each match. Each correct answer earns
            <span class="text-indigo-400 font-semibold">1 point</span>.
          </p>
        </div>
        <span
          class="inline-flex items-center self-start px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <UIcon name="i-heroicons-arrow-path" class="w-3.5 h-3.5 mr-1.5" />
          3 picked per match
        </span>
      </div>

      <ol class="grid grid-cols-1 lg:grid-cols-2 gap-4 list-none p-0 m-0">
        <li v-for="(question, index) in bonusQuestions" :key="question.id"
          class="group bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 rounded-3xl p-6 backdrop-blur-md transition-all duration-300">
          <div class="flex items-start gap-4">
            <span
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 border border-slate-800 text-sm font-bold text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
              {{ index + 1 }}
            </span>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  1 point
                </span>
                <span v-if="question.emptyOption"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/80 text-slate-400 border border-slate-700">
                  Empty option available
                </span>
              </div>
              <p class="text-slate-200 text-sm font-medium leading-relaxed">{{ question.text }}</p>
              <p v-if="question.note" class="text-slate-500 text-xs mt-2 leading-relaxed">{{ question.note }}</p>
            </div>
          </div>
        </li>
      </ol>
    </section>

    <!-- Scoring summary -->
    <div
      class="relative overflow-hidden bg-gradient-to-br from-slate-900/60 to-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
      <div class="absolute -left-10 -bottom-10 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>
      <div class="relative z-10">
        <h2 class="text-lg font-extrabold text-white mb-4 flex items-center gap-2">
          <UIcon name="i-heroicons-bolt" class="w-5 h-5 text-teal-400" />
          Maximum points per match
        </h2>
        <ul class="space-y-3 text-sm">
          <li class="flex justify-between items-center py-2 border-b border-slate-800/80">
            <span class="text-slate-400">Score prediction (exact / correct result)</span>
            <span class="font-bold text-emerald-400">5 / 2 pts</span>
          </li>
          <li class="flex justify-between items-center py-2 border-b border-slate-800/80">
            <span class="text-slate-400">3 bonus questions (1 pt each)</span>
            <span class="font-bold text-indigo-400">3 pts</span>
          </li>
          <li class="flex justify-between items-center pt-1">
            <span class="text-slate-200 font-semibold">Total possible</span>
            <span
              class="text-xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">8
              pts</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const bonusQuestions = [
  {
    id: 'yellow-first',
    text: 'Which team will get the first yellow card?',
    note: 'If no yellow cards are given, select empty.',
    emptyOption: true,
  },
  {
    id: 'yellow-count',
    text: 'How many yellow cards will be given in this match?',
    emptyOption: false,
  },
  {
    id: 'first-goal',
    text: 'Which team will score the first goal?',
    emptyOption: false,
  },
  {
    id: 'penalty',
    text: 'Will there be a penalty in this match during normal time?',
    emptyOption: false,
  },
  {
    id: 'red-card',
    text: 'Will there be any red card given?',
    emptyOption: false,
  },
  {
    id: 'first-sub',
    text: 'Which team will make the first substitution?',
    note: 'If no substitution is made, select empty.',
    emptyOption: true,
  },
]
</script>
