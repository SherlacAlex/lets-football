<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-league-title"
    >
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="close" />

      <div
        class="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-5"
      >
        <div class="flex items-center justify-between gap-3">
          <h2 id="create-league-title" class="text-lg font-extrabold text-white">
            Create league
          </h2>
          <button
            type="button"
            class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
            @click="close"
          >
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
          </button>
        </div>

        <div
          v-if="formMessage"
          :class="[
            formMessageType === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400',
            'p-3 rounded-2xl border text-sm',
          ]"
        >
          {{ formMessage }}
        </div>

        <div
          v-if="createdInviteCode"
          class="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center"
        >
          <p class="text-xs text-slate-400 mb-2">Share this invite code</p>
          <div class="flex items-center justify-center gap-3">
            <p class="text-2xl font-black tracking-[0.2em] text-emerald-400">
              {{ createdInviteCode }}
            </p>
            <button
              type="button"
              class="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors shrink-0"
              :aria-label="copiedInviteCode ? 'Copied' : 'Copy invite code'"
              @click="copyInviteCode"
            >
              <UIcon
                :name="copiedInviteCode ? 'i-heroicons-clipboard-document-check' : 'i-heroicons-clipboard-document'"
                class="w-5 h-5"
              />
            </button>
          </div>
        </div>

        <form v-if="!createdInviteCode" class="space-y-4" @submit.prevent="submit">
          <div>
            <label
              for="league-name"
              class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
            >
              League name
            </label>
            <input
              id="league-name"
              v-model="leagueName"
              type="text"
              required
              maxlength="80"
              placeholder="e.g. Office World Cup"
              class="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-2xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full relative overflow-hidden px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-2xl active:scale-[0.99] transition-all duration-200 disabled:opacity-50"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
              <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
              Creating…
            </span>
            <span v-else>Create league</span>
          </button>
        </form>

        <button
          v-else
          type="button"
          class="w-full px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-2xl transition-colors"
          @click="finish"
        >
          Done
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { apiRoutes } from '~/utils/api'
import { fetchErrorMessage, normalizeCreatedGroup } from '~/utils/groups'

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  created: []
}>()

const leagueName = ref('')
const isSubmitting = ref(false)
const formMessage = ref('')
const formMessageType = ref<'success' | 'error'>('error')
const createdInviteCode = ref('')
const copiedInviteCode = ref(false)

let copyResetTimer: ReturnType<typeof setTimeout> | undefined

async function copyInviteCode() {
  if (!createdInviteCode.value) {
    return
  }

  try {
    await navigator.clipboard.writeText(createdInviteCode.value)
    copiedInviteCode.value = true
    clearTimeout(copyResetTimer)
    copyResetTimer = setTimeout(() => {
      copiedInviteCode.value = false
    }, 2000)
  } catch {
    formMessageType.value = 'error'
    formMessage.value = 'Could not copy invite code.'
  }
}

function close() {
  if (isSubmitting.value) {
    return
  }
  open.value = false
}

function resetForm() {
  leagueName.value = ''
  formMessage.value = ''
  createdInviteCode.value = ''
  copiedInviteCode.value = false
  clearTimeout(copyResetTimer)
}

function finish() {
  emit('created')
  open.value = false
}

watch(open, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
})

async function submit() {
  const name = leagueName.value.trim()
  if (!name) {
    formMessageType.value = 'error'
    formMessage.value = 'League name is required.'
    return
  }

  isSubmitting.value = true
  formMessage.value = ''

  try {
    const response = await $fetch(apiRoutes.groups, {
      method: 'POST',
      body: { name },
    })
    const group = normalizeCreatedGroup(response)
    if (!group) {
      throw new Error('Invalid response from server')
    }
    createdInviteCode.value = group.invite_code
    formMessageType.value = 'success'
    formMessage.value = `"${group.name}" was created successfully.`
  } catch (error) {
    formMessageType.value = 'error'
    formMessage.value = fetchErrorMessage(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
