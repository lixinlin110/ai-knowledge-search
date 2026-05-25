import { defineStore } from 'pinia'
import type { AiRequestStatus, ChatMessage } from '../types'
import { createId } from '../utils/format'
import { getStorage, setStorage } from '../utils/storage'

const CHAT_KEY = 'chat_messages'

interface ChatState {
  messages: ChatMessage[]
  status: AiRequestStatus
  errorMessage: string
  lastQuestion: string
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    messages: getStorage<ChatMessage[]>(CHAT_KEY, []),
    status: 'idle',
    errorMessage: '',
    lastQuestion: '',
  }),
  actions: {
    persist() {
      setStorage(CHAT_KEY, this.messages)
    },
    addUserMessage(content: string) {
      const message: ChatMessage = {
        id: createId('msg'),
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
        status: 'success',
      }
      this.lastQuestion = content
      this.messages.push(message)
      this.persist()
      return message
    },
    addAssistantMessage() {
      const message: ChatMessage = {
        id: createId('msg'),
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
        status: 'streaming',
      }
      this.status = 'streaming'
      this.errorMessage = ''
      this.messages.push(message)
      this.persist()
      return message.id
    },
    appendAssistantContent(messageId: string, chunk: string) {
      const message = this.messages.find((item) => item.id === messageId)
      if (!message) return
      message.content += chunk
      this.persist()
    },
    finishAssistantMessage(messageId: string) {
      const message = this.messages.find((item) => item.id === messageId)
      if (!message) return
      message.status = 'success'
      this.status = 'success'
      this.persist()
    },
    failAssistantMessage(messageId: string, errorMessage: string) {
      const message = this.messages.find((item) => item.id === messageId)
      if (message) {
        message.status = 'error'
        message.errorMessage = errorMessage
      }
      this.status = 'error'
      this.errorMessage = errorMessage
      this.persist()
    },
    markAssistantStopped(messageId: string) {
      const message = this.messages.find((item) => item.id === messageId)
      if (!message) return
      message.status = 'success'
      message.content += '\n\n_生成已停止。_'
      this.status = 'idle'
      this.persist()
    },
    clearMessages() {
      this.messages = []
      this.status = 'idle'
      this.errorMessage = ''
      this.lastQuestion = ''
      this.persist()
    },
  },
})
