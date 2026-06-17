<template>
  <input v-if="answerType === 'NUMBER'" v-model="answer" type="number" min="0" inputmode="numeric"
    placeholder="Enter a number" :disabled="disabled" :class="inputClass" />
  <select v-else v-model="answer" :disabled="disabled" :class="selectClass">
    <option v-for="option in options" :key="option.label" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
import type { Fixture } from '~/types/fixtures'
import type { FixtureQuestion } from '~/types/questions'

const props = withDefaults(
  defineProps<{
    question: FixtureQuestion
    fixture: Fixture
    hasError?: boolean
    disabled?: boolean
    isCorrect?: boolean
  }>(),
  {
    disabled: false,
    isCorrect: false,
  },
)

const fieldStateClass = computed(() => {
  if (props.hasError) {
    return 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
  }
  if (props.isCorrect) {
    return 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500'
  }
  return 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500'
})

const inputClass = computed(() => [
  'mt-3 w-full bg-slate-950 border rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none transition-all duration-200 focus:ring-1 disabled:opacity-60 disabled:cursor-not-allowed',
  fieldStateClass.value,
])

const selectClass = computed(() => [
  'mt-3 w-full bg-slate-950 border rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none transition-all duration-200 focus:ring-1 disabled:opacity-60 disabled:cursor-not-allowed',
  fieldStateClass.value,
])

const answer = defineModel<string | boolean>({ default: '' })

const answerType = computed(() => props.question.question_template.answer_type)

const options = computed(() => {
  const type = answerType.value

  if (type === 'TEAM') {
    return [
      { value: 'NONE', label: 'None' },
      { value: props.fixture.home_team.id, label: props.fixture.home_team.name },
      { value: props.fixture.away_team.id, label: props.fixture.away_team.name },
    ]
  }

  if (type === 'BOOLEAN') {
    return [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ]
  }

  return [{ value: null, label: 'Select an answer' }]
})
</script>
