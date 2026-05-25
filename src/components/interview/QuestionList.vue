<script setup lang="ts">
import type { InterviewQuestion } from '../../types'
import QuestionCard from './QuestionCard.vue'

defineProps<{
  questions: InterviewQuestion[]
}>()
</script>

<template>
  <div class="question-list">
    <QuestionCard v-for="question in questions" :key="question.id" :question="question" />
  </div>
</template>
