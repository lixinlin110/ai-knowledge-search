<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { generateSummary } from '../api/ai'
import EmptyState from '../components/common/EmptyState.vue'
import ErrorState from '../components/common/ErrorState.vue'
import LoadingState from '../components/common/LoadingState.vue'
import SummaryCard from '../components/summary/SummaryCard.vue'
import { useDocumentStore } from '../stores/document'
import { useHistoryStore } from '../stores/history'

const router = useRouter()
const documentStore = useDocumentStore()
const historyStore = useHistoryStore()

const createSummary = async () => {
  if (!documentStore.currentDocument) {
    ElMessage.warning('请先上传文档')
    router.push('/upload')
    return
  }

  try {
    documentStore.setSummaryStatus('loading')
    const summary = await generateSummary({ document: documentStore.currentDocument })
    documentStore.setSummary(summary)
    historyStore.addRecord({
      type: 'summary',
      title: `摘要：${documentStore.currentDocument.name}`,
      description: summary.overview,
      payload: summary,
    })
  } catch (error) {
    documentStore.setSummaryStatus('error', error instanceof Error ? error.message : '摘要生成失败')
  }
}
</script>

<template>
  <main class="page">
    <section class="page-heading">
      <p class="eyebrow">Summary</p>
      <h1>AI 摘要</h1>
      <p>根据当前上传文档生成摘要、关键词、核心知识点和适合写进简历的项目亮点。</p>
    </section>

    <EmptyState
      v-if="!documentStore.currentDocument"
      title="还没有上传文档"
      description="上传 txt 或 md 文件后，才能生成对应摘要。"
      action-text="去上传文档"
      @action="router.push('/upload')"
    />

    <template v-else>
      <section class="panel action-panel">
        <div>
          <p class="eyebrow">当前文档</p>
          <h2>{{ documentStore.currentDocument.name }}</h2>
        </div>
        <el-button type="primary" :loading="documentStore.summaryStatus === 'loading'" @click="createSummary">
          {{ documentStore.summary ? '重新生成摘要' : '生成摘要' }}
        </el-button>
      </section>

      <LoadingState v-if="documentStore.summaryStatus === 'loading'" text="正在分析文档结构并生成摘要..." />
      <ErrorState
        v-else-if="documentStore.summaryStatus === 'error'"
        :message="documentStore.errorMessage"
        retry-text="重新生成"
        @retry="createSummary"
      />
      <SummaryCard v-else-if="documentStore.summary" :summary="documentStore.summary" />
      <EmptyState v-else title="摘要尚未生成" description="点击生成摘要，查看 mock AI 生成结果。" />
    </template>
  </main>
</template>
