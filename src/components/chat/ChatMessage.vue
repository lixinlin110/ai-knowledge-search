<script setup lang="ts">
import { CopyDocument, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import MarkdownIt from 'markdown-it'
import { computed } from 'vue'
import type { ChatMessage as ChatMessageType } from '../../types'
import { formatDate } from '../../utils/format'

const props = defineProps<{
  message: ChatMessageType
}>()

const emit = defineEmits<{
  retry: []
}>()

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
})

const renderedContent = computed(() => markdown.render(props.message.content || ''))

const copyMessage = async () => {
  await navigator.clipboard.writeText(props.message.content)
  ElMessage.success('回答已复制')
}
</script>

<template>
  <article class="chat-message" :class="message.role">
    <div class="message-avatar">{{ message.role === 'user' ? '我' : 'AI' }}</div>
    <div class="message-body">
      <div class="message-meta">
        <span>{{ message.role === 'user' ? '用户提问' : '知识库回答' }}</span>
        <span>{{ formatDate(message.createdAt) }}</span>
      </div>

      <div v-if="message.role === 'assistant'" class="markdown-body" v-html="renderedContent" />
      <p v-else class="plain-message">{{ message.content }}</p>

      <el-alert
        v-if="message.status === 'error'"
        class="message-error"
        :title="message.errorMessage || '生成失败'"
        type="error"
        show-icon
        :closable="false"
      />

      <div v-if="message.role === 'assistant'" class="message-actions">
        <el-button :icon="CopyDocument" size="small" plain :disabled="!message.content" @click="copyMessage">
          复制
        </el-button>
        <el-button v-if="message.status === 'error'" :icon="RefreshRight" size="small" plain @click="emit('retry')">
          重试
        </el-button>
      </div>
    </div>
  </article>
</template>
