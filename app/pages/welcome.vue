<template>
  <div class="relative min-h-[calc(100vh-140px)] flex flex-col justify-center overflow-hidden py-12 sm:py-24">
    <div class="absolute inset-0 z-0 overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style="background-image: url('/FIFA.jpg')"
        aria-hidden="true"
      />
      <div class="absolute inset-0 bg-slate-950/50" aria-hidden="true" />
      <div
        class="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/40 to-slate-950/65"
        aria-hidden="true"
      />
      <div
        class="absolute -top-[30%] -left-[15%] w-[70%] h-[70%] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none"
        aria-hidden="true"
      />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
      <!-- Hero Section -->
      <div class="text-center max-w-3xl mx-auto space-y-8">
        <!-- Badge -->
        <div
          class="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-emerald-400 uppercase animate-fade-in">
          <UIcon name="i-heroicons-sparkles" class="w-4 h-4 text-emerald-400" />
          <span>Predict & Win &bull; World Cup 2026</span>
        </div>

        <!-- Main Title -->
        <h1 class="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight sm:leading-none">
          Predict the Matches.
          <span
            class="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-500 bg-clip-text text-transparent block mt-2">
            Claim Global Glory.
          </span>
        </h1>

        <!-- Subtitle -->
        <p class="text-lg sm:text-xl text-slate-400 font-normal leading-relaxed">
          Join the ultimate FIFA WORLD CUP 2026 Prediction Contest. Predict scores, challenge friends and climb the
          leaderboard as the matches unfold.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <NuxtLink to="/dashboard"
            class="w-full sm:w-auto relative group overflow-hidden px-8 py-4 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 text-slate-950 font-bold rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 text-center">
            <span class="relative z-10 flex items-center justify-center space-x-2">
              <span>Start Predicting Now</span>
              <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 font-bold" />
            </span>
            <div
              class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            </div>
          </NuxtLink>

          <NuxtLink v-if="!user" to="/login"
            class="w-full sm:w-auto px-8 py-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold rounded-2xl backdrop-blur-md active:scale-95 transition-all duration-200 text-center">
            Login to Account
          </NuxtLink>
        </div>
      </div>

      <!-- Feature Cards Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
        <!-- Card 1 -->
        <div
          class="group relative bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/30 rounded-3xl p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-2">
          <div
            class="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full group-hover:bg-emerald-500/10 transition-colors duration-300">
          </div>
          <div
            class="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-300">
            <UIcon name="i-heroicons-swatch" class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-slate-100 mb-3">Live Score Prediction</h3>
          <p class="text-slate-400 text-sm leading-relaxed">
            Predict precise outcomes of every group stage and knockout game. Update your picks until the kick-off
            whistle.
          </p>
        </div>

        <!-- Card 2 -->
        <div
          class="group relative bg-slate-900/40 border border-slate-800/80 hover:border-teal-500/30 rounded-3xl p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-2">
          <div
            class="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-full group-hover:bg-teal-500/10 transition-colors duration-300">
          </div>
          <div
            class="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform duration-300">
            <UIcon name="i-heroicons-user-group" class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-slate-100 mb-3">Compete with Leagues</h3>
          <p class="text-slate-400 text-sm leading-relaxed">
            Create public or private mini-leagues. Challenge friends, coworkers, or family to see who reigns as the
            football guru.
          </p>
        </div>

        <!-- Card 3 -->
        <div
          class="group relative bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/30 rounded-3xl p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-2">
          <div
            class="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full group-hover:bg-indigo-500/10 transition-colors duration-300">
          </div>
          <div
            class="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300">
            <UIcon name="i-heroicons-bolt" class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-slate-100 mb-3">Real-time Leaderboard</h3>
          <p class="text-slate-400 text-sm leading-relaxed">
            Earn points based on exact scores, outcomes, or goal differences. Watch your rank jump dynamically on our
            live feed.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_DESCRIPTION, SITE_NAME } from '~/utils/seo'

definePageMeta({
  layout: 'default',
})

useAppSeo({
  path: '/welcome',
  description:
    'Join the FIFA World Cup 2026 prediction game. Predict match scores, answer bonus questions, create private leagues with friends, and climb the live leaderboard.',
})

useAppStructuredData({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  applicationCategory: 'GameApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  about: {
    '@type': 'SportsEvent',
    name: 'FIFA World Cup 2026',
  },
  featureList: [
    'Live World Cup 2026 score predictions',
    'Bonus match questions',
    'Private prediction leagues',
    'Real-time leaderboard',
  ],
})

const user = useSupabaseUser()
</script>