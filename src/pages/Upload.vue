<script setup lang="ts">
import { useRouter } from 'vue-router'
import DocumentPreview from '../components/upload/DocumentPreview.vue'
import UploadPanel from '../components/upload/UploadPanel.vue'
import { useDocumentStore } from '../stores/document'
import { useHistoryStore } from '../stores/history'
import type { DocumentInfo } from '../types'
import { truncateText } from '../utils/format'

const router = useRouter()
const documentStore = useDocumentStore()
const historyStore = useHistoryStore()

const handleUploaded = (document: DocumentInfo) => {
  documentStore.setDocument(document)
  historyStore.addRecord({
    type: 'document',
    title: document.name,
    description: truncateText(document.content, 90),
    payload: document,
  })
}
</script>

<template>
  <main class="page">
    <section class="page-heading">
      <p class="eyebrow">Upload</p>
      <h1>文档上传</h1>
      <p>上传 README、实验报告、论文笔记或 Markdown 文档，系统会读取文本内容并作为后续 AI 摘要和问答的数据源。</p>
    </section>

    <UploadPanel @uploaded="handleUploaded" />

    <DocumentPreview v-if="documentStore.currentDocument" :document="documentStore.currentDocument" />

    <div v-if="documentStore.currentDocument" class="next-actions">
      <el-button type="primary" @click="router.push('/summary')">生成 AI 摘要</el-button>
      <el-button plain @click="router.push('/chat')">进入文档问答</el-button>
    </div>
  </main>
</template>
