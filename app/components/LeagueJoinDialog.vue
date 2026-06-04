<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-league-title"
    >
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="close" />

      <div
        class="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-5"
      >
        <div class="flex items-center justify-between gap-3">
          <h2 id="join-league-title" class="text-lg font-extrabold text-white">
            Join league
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

        <form class="space-y-4" @submit.prevent="submit">
          <div>
            <label
              for="invite-code"
              class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2"
            >
              Invite code
            </label>
            <input
              id="invite-code"
              v-model="inviteCode"
              type="text"
              required
              maxlength="6"
              autocomplete="off"
              placeholder="6-character code"
              class="w-full bg-slate-950/60 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-2xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none transition-all duration-200 uppercase tracking-widest text-center font-bold"
              @input="inviteCode = inviteCode.toUpperCase().replace(/[^A-Z0-9]/g, '')"
            />
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full relative overflow-hidden px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-2xl active:scale-[0.99] transition-all duration-200 disabled:opacity-50"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
              <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
              Joining…
            </span>
            <span v-else>Join league</span>
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { apiRoutes } from '~/utils/api'
import { fetchErrorMessage } from '~/utils/groups'

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  joined: []
}>()

const inviteCode = ref('')
const isSubmitting = ref(false)
const formMessage = ref('')
const formMessageType = ref<'success' | 'error'>('error')

function close() {
  if (isSubmitting.value) {
    return
  }
  open.value = false
}

watch(open, (isOpen) => {
  if (!isOpen) {
    inviteCode.value = ''
    formMessage.value = ''
  }
})

async function submit() {
  const code = inviteCode.value.trim()
  if (!code) {
    formMessageType.value = 'error'
    formMessage.value = 'Invite code is required.'
    return
  }

  isSubmitting.value = true
  formMessage.value = ''

  try {
    const response = await $fetch<{ message?: string; data?: { groupName?: string } }>(
      apiRoutes.joinGroup,
      {
        method: 'POST',
        body: { inviteCode: code },
      },
    )
    formMessageType.value = 'success'
    formMessage.value =
      response.message ??
      (response.data?.groupName
        ? `Joined "${response.data.groupName}" successfully.`
        : 'Joined the league successfully.')
    emit('joined')
    setTimeout(() => {
      open.value = false
    }, 900)
  } catch (error) {
    formMessageType.value = 'error'
    formMessage.value = fetchErrorMessage(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
