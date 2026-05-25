<script setup lang="ts">
import type { InterviewQuestion } from '../../types'

const modeMap: Record<InterviewQuestion['mode'], string> = {
  basic: '基础型',
  deep: '项目深挖型',
  pressure: '压力面试型',
}

defineProps<{
  question: InterviewQuestion
}>()
</script>

<template>
  <article class="question-card">
    <div class="question-title">
      <el-tag>{{ modeMap[question.mode] }}</el-tag>
      <h3>{{ question.question }}</h3>
    </div>

    <div class="question-block">
      <strong>参考回答</strong>
      <p>{{ question.answer }}</p>
    </div>

    <div class="question-grid">
      <div class="question-block">
        <strong>进一步追问</strong>
        <ul>
          <li v-for="item in question.followUps" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div class="question-block">
        <strong>需要补习的知识点</strong>
        <ul>
          <li v-for="item in question.knowledgeGaps" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </article>
</template>
