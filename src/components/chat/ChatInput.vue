<script setup lang="ts">
import { RefreshRight, VideoPause } from '@element-plus/icons-vue'
import { ref } from 'vue'

defineProps<{
  disabled?: boolean
  streaming?: boolean
  canRegenerate?: boolean
}>()

const emit = defineEmits<{
  submit: [question: string]
  stop: []
  regenerate: []
}>()

const question = ref('')

const submit = () => {
  const value = question.value.trim()
  if (!value) return
  emit('submit', value)
  question.value = ''
}
</script>

<template>
  <div class="chat-input">
    <el-input
      v-model="question"
      type="textarea"
      :rows="3"
      resize="none"
      :disabled="disabled || streaming"
      placeholder="基于当前文档提问，例如：这个项目最适合写进简历的亮点是什么？"
      @keydown.enter.exact.prevent="submit"
    />
    <div class="chat-input-actions">
      <el-button v-if="streaming" type="warning" :icon="VideoPause" @click="emit('stop')">
        停止生成
      </el-button>
      <el-button v-else plain :icon="RefreshRight" :disabled="!canRegenerate" @click="emit('regenerate')">
        重新生成
      </el-button>
      <el-button type="primary" :disabled="disabled || streaming || !question.trim()" @click="submit">
        发送问题
      </el-button>
    </div>
  </div>
</template>
