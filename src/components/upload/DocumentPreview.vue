<script setup lang="ts">
import { computed } from 'vue'
import type { DocumentInfo } from '../../types'
import { formatDate, formatFileSize } from '../../utils/format'

const props = defineProps<{
  document: DocumentInfo
}>()

const preview = computed(() => props.document.content.slice(0, 1800))
</script>

<template>
  <section class="panel document-preview">
    <div class="panel-header">
      <div>
        <p class="eyebrow">文档预览</p>
        <h2>{{ document.name }}</h2>
      </div>
      <el-tag type="success">已上传</el-tag>
    </div>

    <el-descriptions :column="3" border>
      <el-descriptions-item label="大小">{{ formatFileSize(document.size) }}</el-descriptions-item>
      <el-descriptions-item label="类型">.{{ document.extension }}</el-descriptions-item>
      <el-descriptions-item label="时间">{{ formatDate(document.createdAt) }}</el-descriptions-item>
    </el-descriptions>

    <pre class="preview-box">{{ preview }}</pre>
  </section>
</template>
