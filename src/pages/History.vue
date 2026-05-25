<script setup lang="ts">
import { Delete, View } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'
import EmptyState from '../components/common/EmptyState.vue'
import { useHistoryStore } from '../stores/history'
import type { HistoryRecord, HistoryRecordType } from '../types'
import { formatDate, truncateText } from '../utils/format'

const historyStore = useHistoryStore()
const detailVisible = ref(false)
const activeRecord = ref<HistoryRecord | null>(null)

const typeMap: Record<HistoryRecordType, string> = {
  document: '文档',
  summary: '摘要',
  chat: '问答',
  interview: '面试',
}

const records = computed(() => historyStore.records)

const openDetail = (record: HistoryRecord) => {
  activeRecord.value = record
  detailVisible.value = true
}

const deleteRecord = async (record: HistoryRecord) => {
  await ElMessageBox.confirm(`确认删除「${record.title}」吗？`, '删除记录', { type: 'warning' })
  historyStore.deleteRecord(record.id)
}

const clearAll = async () => {
  await ElMessageBox.confirm('确认清空全部历史记录吗？', '清空历史', { type: 'warning' })
  historyStore.clearRecords()
}
</script>

<template>
  <main class="page">
    <section class="page-heading">
      <p class="eyebrow">History</p>
      <h1>历史记录</h1>
      <p>展示最近上传的文档、摘要结果、历史问答和面试追问，数据通过 Pinia + localStorage 持久化。</p>
    </section>

    <section v-if="records.length" class="panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Records</p>
          <h2>最近记录</h2>
        </div>
        <el-button type="danger" plain @click="clearAll">清空历史</el-button>
      </div>

      <el-table :data="records" row-key="id">
        <el-table-column label="类型" width="100">
          <template #default="{ row }: { row: HistoryRecord }">
            <el-tag>{{ typeMap[row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="220" />
        <el-table-column label="描述" min-width="320">
          <template #default="{ row }: { row: HistoryRecord }">
            {{ truncateText(row.description, 80) }}
          </template>
        </el-table-column>
        <el-table-column label="时间" width="150">
          <template #default="{ row }: { row: HistoryRecord }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }: { row: HistoryRecord }">
            <el-button :icon="View" size="small" text @click="openDetail(row)">查看</el-button>
            <el-button :icon="Delete" size="small" text type="danger" @click="deleteRecord(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <EmptyState v-else title="暂无历史记录" description="上传文档、生成摘要或进行问答后，记录会出现在这里。" />

    <el-dialog v-model="detailVisible" title="记录详情" width="720px">
      <pre class="detail-json">{{ JSON.stringify(activeRecord, null, 2) }}</pre>
    </el-dialog>
  </main>
</template>
