<template>
  <input v-if="answerType === 'NUMBER'" v-model="answer" type="number" min="0" inputmode="numeric"
    placeholder="Enter a number"
    class="mt-3 w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none transition-all duration-200" />
  <select v-else v-model="answer" :class="selectClass">
    <option v-for="option in options" :key="option.label" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
import type { Fixture } from '~/types/fixtures'
import type { FixtureQuestion } from '~/types/questions'

const props = defineProps<{
  question: FixtureQuestion
  fixture: Fixture
  hasError?: boolean
}>()

const selectClass = computed(() => [
  'mt-3 w-full bg-slate-950 border rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none transition-all duration-200 focus:ring-1',
  props.hasError
    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
    : 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500',
])

const answer = defineModel<string | boolean>({ default: '' })

const answerType = computed(() => props.question.question_template.answer_type)

const options = computed(() => {
  const type = answerType.value

  if (type === 'TEAM') {
    return [
      { value: '', label: 'None' },
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
