<script setup lang="ts">
import type { DocumentSummary } from '../../types'
import { formatDate } from '../../utils/format'
import KeywordList from './KeywordList.vue'

defineProps<{
  summary: DocumentSummary
}>()
</script>

<template>
  <section class="summary-card panel">
    <div class="panel-header">
      <div>
        <p class="eyebrow">AI 摘要</p>
        <h2>文档知识提炼</h2>
      </div>
      <el-tag>{{ formatDate(summary.createdAt) }}</el-tag>
    </div>

    <div class="summary-section">
      <h3>摘要</h3>
      <p>{{ summary.overview }}</p>
    </div>

    <div class="summary-section">
      <h3>关键词</h3>
      <KeywordList :keywords="summary.keywords" />
    </div>

    <div class="summary-grid">
      <div class="summary-section">
        <h3>核心知识点</h3>
        <ul>
          <li v-for="item in summary.knowledgePoints" :key="item">{{ item }}</li>
        </ul>
      </div>

      <div class="summary-section">
        <h3>简历项目亮点</h3>
        <ul>
          <li v-for="item in summary.resumeHighlights" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>
