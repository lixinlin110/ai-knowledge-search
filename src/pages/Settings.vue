<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useChatStore } from '../stores/chat'
import { useDocumentStore } from '../stores/document'
import { useHistoryStore } from '../stores/history'
import { useThemeStore } from '../stores/theme'
import { useUserStore } from '../stores/user'
import type { ThemeMode } from '../types'
import { clearAppStorage } from '../utils/storage'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const documentStore = useDocumentStore()
const chatStore = useChatStore()
const historyStore = useHistoryStore()

const changeTheme = (mode: ThemeMode) => {
  themeStore.setTheme(mode)
}

const clearCache = async () => {
  await ElMessageBox.confirm('确认清空本地缓存吗？登录态、文档和历史记录都会被清除。', '清空缓存', { type: 'warning' })
  clearAppStorage()
  documentStore.clearDocument()
  chatStore.clearMessages()
  historyStore.clearRecords()
  userStore.logout()
  ElMessage.success('本地缓存已清空')
  router.replace('/login')
}

const logout = () => {
  userStore.logout()
  router.replace('/login')
}
</script>

<template>
  <main class="page">
    <section class="page-heading">
      <p class="eyebrow">Settings</p>
      <h1>设置</h1>
      <p>管理主题、本地缓存和当前登录状态。</p>
    </section>

    <section class="settings-grid">
      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Theme</p>
            <h2>主题模式</h2>
          </div>
        </div>
        <el-radio-group :model-value="themeStore.mode" @change="changeTheme">
          <el-radio-button label="light">亮色</el-radio-button>
          <el-radio-button label="dark">暗色</el-radio-button>
        </el-radio-group>
      </div>

      <div class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Account</p>
            <h2>登录状态</h2>
          </div>
          <el-tag :type="userStore.isLoggedIn ? 'success' : 'danger'">
            {{ userStore.isLoggedIn ? '已登录' : '未登录' }}
          </el-tag>
        </div>
        <el-descriptions v-if="userStore.userInfo" :column="1" border>
          <el-descriptions-item label="用户名">{{ userStore.userInfo.username }}</el-descriptions-item>
          <el-descriptions-item label="角色">{{ userStore.userInfo.role }}</el-descriptions-item>
          <el-descriptions-item label="登录时间">{{ userStore.userInfo.loginAt }}</el-descriptions-item>
        </el-descriptions>
        <div class="next-actions">
          <el-button plain @click="logout">退出登录</el-button>
          <el-button type="danger" plain @click="clearCache">清空本地缓存</el-button>
        </div>
      </div>
    </section>
  </main>
</template>
