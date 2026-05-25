<script setup lang="ts">
defineProps<{
  keywords: string[]
}>()
</script>

<template>
  <div class="keyword-list">
    <el-tag v-for="keyword in keywords" :key="keyword" effect="plain">
      {{ keyword }}
    </el-tag>
  </div>
</template>
