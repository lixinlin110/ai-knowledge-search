<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, nextTick, ref, shallowRef } from 'vue'
import { askDocumentQuestion } from '../../api/ai'
import { useChatStore } from '../../stores/chat'
import { useDocumentStore } from '../../stores/document'
import { useHistoryStore } from '../../stores/history'
import { readTextStream } from '../../utils/stream'
import EmptyState from '../common/EmptyState.vue'
import ChatInput from './ChatInput.vue'
import ChatMessage from './ChatMessage.vue'

const chatStore = useChatStore()
const documentStore = useDocumentStore()
const historyStore = useHistoryStore()

const messageListRef = ref<HTMLElement>()
const abortController = shallowRef<AbortController | null>(null)

const isStreaming = computed(() => chatStore.status === 'streaming')
const hasMessages = computed(() => chatStore.messages.length > 0)

const scrollToBottom = async () => {
  await nextTick()
  messageListRef.value?.scrollTo({ top: messageListRef.value.scrollHeight, behavior: 'smooth' })
}

const ask = async (question: string, options: { silentUserMessage?: boolean } = {}) => {
  const document = documentStore.currentDocument
  if (!document) {
    ElMessage.warning('请先上传文档，再进行问答')
    return
  }

  if (!options.silentUserMessage) {
    chatStore.addUserMessage(question)
  }

  const assistantId = chatStore.addAssistantMessage()
  abortController.value = new AbortController()
  await scrollToBottom()

  try {
    const stream = await askDocumentQuestion({ document, question }, abortController.value.signal)
    await readTextStream(stream, (chunk) => {
      chatStore.appendAssistantContent(assistantId, chunk)
      scrollToBottom()
    })
    chatStore.finishAssistantMessage(assistantId)
    historyStore.addRecord({
      type: 'chat',
      title: question,
      description: `基于 ${document.name} 的问答记录`,
      payload: chatStore.messages.slice(-2),
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      chatStore.markAssistantStopped(assistantId)
      return
    }

    const message = error instanceof Error ? error.message : 'AI 请求失败，请稍后重试'
    chatStore.failAssistantMessage(assistantId, message)
    ElMessage.error(message)
  } finally {
    abortController.value = null
  }
}

const stop = () => {
  abortController.value?.abort()
}

const regenerate = () => {
  if (!chatStore.lastQuestion) {
    const lastUserMessage = [...chatStore.messages].reverse().find((message) => message.role === 'user')
    if (!lastUserMessage) return
    ask(lastUserMessage.content, { silentUserMessage: true })
    return
  }
  ask(chatStore.lastQuestion, { silentUserMessage: true })
}
</script>

<template>
  <section class="chat-box panel">
    <div class="panel-header">
      <div>
        <p class="eyebrow">AI 文档问答</p>
        <h2>基于当前文档进行追问</h2>
      </div>
      <el-button v-if="hasMessages" plain @click="chatStore.clearMessages()">清空对话</el-button>
    </div>

    <div ref="messageListRef" class="chat-messages">
      <EmptyState
        v-if="!hasMessages"
        title="还没有问答记录"
        description="上传文档后，可以针对内容进行摘要解释、简历表达和面试追问。"
      />
      <ChatMessage
        v-for="message in chatStore.messages"
        :key="message.id"
        :message="message"
        @retry="regenerate"
      />
    </div>

    <ChatInput
      :disabled="!documentStore.currentDocument"
      :streaming="isStreaming"
      :can-regenerate="hasMessages && !isStreaming"
      @submit="ask"
      @stop="stop"
      @regenerate="regenerate"
    />
  </section>
</template>
