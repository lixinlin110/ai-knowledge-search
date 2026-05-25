<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="loading-state">
    <el-skeleton :rows="4" animated />
    <p>{{ text || '正在生成，请稍候...' }}</p>
  </div>
</template>
