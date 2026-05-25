<script setup lang="ts">
import { Document } from '@element-plus/icons-vue'

defineProps<{
  title: string
  description?: string
  actionText?: string
}>()

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="empty-state">
    <el-empty :description="title">
      <template #image>
        <el-icon class="state-icon"><Document /></el-icon>
      </template>
      <p v-if="description" class="state-description">{{ description }}</p>
      <el-button v-if="actionText" type="primary" @click="emit('action')">
        {{ actionText }}
      </el-button>
    </el-empty>
  </div>
</template>
