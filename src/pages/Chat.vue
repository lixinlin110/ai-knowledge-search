<script setup lang="ts">
import { useRouter } from 'vue-router'
import ChatBox from '../components/chat/ChatBox.vue'
import EmptyState from '../components/common/EmptyState.vue'
import { useDocumentStore } from '../stores/document'

const router = useRouter()
const documentStore = useDocumentStore()
</script>

<template>
  <main class="page">
    <section class="page-heading">
      <p class="eyebrow">Chat</p>
      <h1>文档问答</h1>
      <p>基于当前文档进行 mock AI 问答，支持流式输出、停止生成、重新生成、复制回答和失败重试。</p>
    </section>

    <EmptyState
      v-if="!documentStore.currentDocument"
      title="请先上传文档"
      description="问答会基于当前文档内容生成回答。"
      action-text="去上传文档"
      @action="router.push('/upload')"
    />

    <ChatBox v-else />
  </main>
</template>
