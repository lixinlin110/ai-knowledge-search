<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { generateInterviewQuestions } from '../api/ai'
import EmptyState from '../components/common/EmptyState.vue'
import LoadingState from '../components/common/LoadingState.vue'
import QuestionList from '../components/interview/QuestionList.vue'
import { useDocumentStore } from '../stores/document'
import { useHistoryStore } from '../stores/history'
import type { InterviewMode, InterviewQuestion } from '../types'

const documentStore = useDocumentStore()
const historyStore = useHistoryStore()

const mode = ref<InterviewMode>('basic')
const projectDescription = ref('Vue3 + TypeScript 智能文档搜索与知识库问答平台，包含上传、摘要、问答、面试追问和历史记录。')
const loading = ref(false)
const questions = ref<InterviewQuestion[]>([])

const createQuestions = async () => {
  if (!documentStore.currentDocument && !projectDescription.value.trim()) {
    ElMessage.warning('请先上传文档，或填写项目描述')
    return
  }

  try {
    loading.value = true
    questions.value = await generateInterviewQuestions({
      document: documentStore.currentDocument,
      projectDescription: projectDescription.value,
      mode: mode.value,
    })
    historyStore.addRecord({
      type: 'interview',
      title: `面试追问：${mode.value}`,
      description: `生成 ${questions.value.length} 个面试问题`,
      payload: questions.value,
    })
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '面试追问生成失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="page">
    <section class="page-heading">
      <p class="eyebrow">Interview</p>
      <h1>面试追问生成</h1>
      <p>根据当前文档或项目描述生成面试官可能追问的问题，覆盖高频问题、参考回答、进一步追问和补习知识点。</p>
    </section>

    <section class="panel form-panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Mode</p>
          <h2>生成配置</h2>
        </div>
        <el-tag v-if="documentStore.currentDocument" type="success">
          当前文档：{{ documentStore.currentDocument.name }}
        </el-tag>
      </div>

      <el-form label-position="top">
        <el-form-item label="追问模式">
          <el-radio-group v-model="mode">
            <el-radio-button label="basic">基础型</el-radio-button>
            <el-radio-button label="deep">项目深挖型</el-radio-button>
            <el-radio-button label="pressure">压力面试型</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="项目描述补充">
          <el-input
            v-model="projectDescription"
            type="textarea"
            :rows="4"
            resize="none"
            placeholder="没有上传文档时，可以在这里粘贴项目描述。"
          />
        </el-form-item>
      </el-form>

      <el-button type="primary" :loading="loading" @click="createQuestions">生成面试追问</el-button>
    </section>

    <LoadingState v-if="loading" text="正在模拟面试官追问..." />
    <QuestionList v-else-if="questions.length" :questions="questions" />
    <EmptyState v-else title="还没有生成面试问题" description="选择一种模式后点击生成，查看结构化追问结果。" />
  </main>
</template>
