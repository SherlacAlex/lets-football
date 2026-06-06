<template>
  <div class="relative min-h-[calc(100vh-140px)] flex items-center justify-center overflow-hidden py-12 px-6">
    <!-- Glowing background elements -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-[20%] left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px]"></div>
      <div class="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px]"></div>
    </div>

    <!-- Login Card -->
    <div
      class="w-full max-w-md bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 sm:p-10 backdrop-blur-xl relative z-10 shadow-2xl">
      <!-- Title -->
      <div class="text-center mb-8">
        <div class="inline-flex bg-emerald-500/10 p-3 rounded-2xl text-emerald-400 mb-4">
          <UIcon name="i-heroicons-lock-closed" class="w-6 h-6" />
        </div>
        <h2 class="text-3xl font-extrabold tracking-tight text-white">Welcome Back</h2>
        <p class="text-slate-400 mt-2 text-sm">Sign in to lock in your predictions</p>
      </div>

      <!-- Error / Success Alert -->
      <div v-if="errorMessage"
        class="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start space-x-2">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 flex-shrink-0 mt-0.5" />
        <span>{{ errorMessage }}</span>
      </div>
      <div v-if="successMessage"
        class="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-start space-x-2">
        <UIcon name="i-heroicons-check-circle" class="w-5 h-5 flex-shrink-0 mt-0.5" />
        <span>{{ successMessage }}</span>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email
            Address</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
            </div>
            <input id="email" type="email" required v-model="email" placeholder="name@example.com"
              class="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none transition-all duration-200" />
          </div>
        </div>

        <div>
          <label for="password"
            class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Password</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <UIcon name="i-heroicons-key" class="w-5 h-5" />
            </div>
            <input id="password" type="password" required v-model="password" placeholder="••••••••"
              class="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none transition-all duration-200" />
          </div>
        </div>

        <button type="submit" :disabled="isLoading"
          class="w-full relative group overflow-hidden px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-2xl shadow-xl shadow-emerald-500/10 hover:scale-[1.01] active:scale-95 transition-all duration-200 flex justify-center items-center disabled:opacity-50">
          <span v-if="isLoading" class="flex items-center space-x-2">
            <svg class="animate-spin h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span>Logging in...</span>
          </span>
          <span v-else class="relative z-10 flex items-center space-x-2">
            <span>Sign In</span>
            <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 font-bold" />
          </span>
          <div
            class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          </div>
        </button>
      </form>

      <!-- Footer redirect link -->
      <div class="text-center mt-8 pt-6 border-t border-slate-800/80">
        <p class="text-sm text-slate-400">
          Don't have an account?
          <NuxtLink
            :to="route.query.redirect ? { path: '/register', query: { redirect: route.query.redirect } } : '/register'"
            class="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-200"
          >
            Sign up for free
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'default',
  middleware: 'guest',
})

const route = useRoute()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const client = useSupabaseClient()

const redirectTo = computed(() => {
  const redirect = route.query.redirect
  if (typeof redirect === 'string' && redirect.startsWith('/')) {
    return redirect
  }
  return '/dashboard'
})

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const { error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) {
      errorMessage.value = error.message
    } else {
      successMessage.value = 'Login successful! Redirecting...'
      setTimeout(() => {
        navigateTo(redirectTo.value)
      }, 1000)
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'An unexpected error occurred.'
  } finally {
    isLoading.value = false
  }
}
</script>