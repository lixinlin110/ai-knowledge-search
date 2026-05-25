<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import type { DocumentInfo } from '../../types'
import { ACCEPTED_EXTENSIONS, MAX_FILE_SIZE, createDocumentInfo, readTextFile, validateFile } from '../../utils/file'
import { formatFileSize } from '../../utils/format'

const props = withDefaults(
  defineProps<{
    acceptedExtensions?: string[]
    maxSize?: number
  }>(),
  {
    acceptedExtensions: () => ACCEPTED_EXTENSIONS,
    maxSize: MAX_FILE_SIZE,
  },
)

const emit = defineEmits<{
  uploaded: [document: DocumentInfo]
}>()

const fileInputRef = ref<HTMLInputElement>()
const dragActive = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const currentFile = ref<File | null>(null)

const acceptText = computed(() => props.acceptedExtensions.map((item) => `.${item}`).join(', '))
const maxSizeText = computed(() => formatFileSize(props.maxSize))

const openFilePicker = () => {
  fileInputRef.value?.click()
}

const handleFile = async (file?: File) => {
  if (!file) return

  currentFile.value = file
  errorMessage.value = ''

  const validation = validateFile(file, props.acceptedExtensions, props.maxSize)
  if (!validation.valid) {
    errorMessage.value = validation.message || '文件校验失败'
    ElMessage.error(errorMessage.value)
    return
  }

  try {
    loading.value = true
    const content = await readTextFile(file)
    const document = createDocumentInfo(file, content)
    emit('uploaded', document)
    ElMessage.success('文档上传成功')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '上传失败，请重试'
    ElMessage.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}

const handleInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  handleFile(target.files?.[0])
  target.value = ''
}

const handleDrop = (event: DragEvent) => {
  dragActive.value = false
  handleFile(event.dataTransfer?.files?.[0])
}
</script>

<template>
  <section class="panel upload-panel">
    <div
      class="upload-dropzone"
      :class="{ active: dragActive, loading }"
      @click="openFilePicker"
      @dragover.prevent="dragActive = true"
      @dragleave.prevent="dragActive = false"
      @drop.prevent="handleDrop"
    >
      <el-icon class="upload-icon"><UploadFilled /></el-icon>
      <h2>拖拽文档到这里，或点击上传</h2>
      <p>支持 {{ acceptText }}，单个文件不超过 {{ maxSizeText }}。PDF 解析位置已预留，当前版本先使用 mock 说明。</p>
      <el-button type="primary" :loading="loading">选择文件</el-button>
      <input ref="fileInputRef" class="hidden-input" type="file" :accept="acceptText" @change="handleInputChange" />
    </div>

    <div v-if="currentFile" class="file-meta">
      <div>
        <strong>{{ currentFile.name }}</strong>
        <p>{{ formatFileSize(currentFile.size) }} · {{ currentFile.type || 'text/plain' }}</p>
      </div>
      <el-tag :type="errorMessage ? 'danger' : 'info'">
        {{ errorMessage ? '上传失败' : loading ? '读取中' : '等待处理' }}
      </el-tag>
    </div>

    <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon :closable="false" />
  </section>
</template>
