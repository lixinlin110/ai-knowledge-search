<script setup lang="ts">
import { CircleClose } from '@element-plus/icons-vue'

defineProps<{
  title?: string
  message: string
  retryText?: string
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="error-state">
    <el-icon class="state-icon error"><CircleClose /></el-icon>
    <h3>{{ title || '操作失败' }}</h3>
    <p>{{ message }}</p>
    <el-button v-if="retryText" type="primary" plain @click="emit('retry')">
      {{ retryText }}
    </el-button>
  </div>
</template>
