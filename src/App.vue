<script setup lang="ts">
import {
  ChatLineRound,
  Clock,
  DocumentAdd,
  House,
  MagicStick,
  QuestionFilled,
  Setting,
  SwitchButton,
} from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from './stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isLoginPage = computed(() => route.path === '/login')

const navItems = [
  { path: '/home', label: '首页', icon: House },
  { path: '/upload', label: '文档上传', icon: DocumentAdd },
  { path: '/summary', label: 'AI 摘要', icon: MagicStick },
  { path: '/chat', label: '文档问答', icon: ChatLineRound },
  { path: '/interview', label: '面试追问', icon: QuestionFilled },
  { path: '/history', label: '历史记录', icon: Clock },
  { path: '/settings', label: '设置', icon: Setting },
]

const handleSelect = (path: string) => {
  router.push(path)
}

const logout = () => {
  userStore.logout()
  router.replace('/login')
}
</script>

<template>
  <router-view v-if="isLoginPage" />

  <el-container v-else class="app-shell">
    <el-aside width="236px" class="app-sidebar">
      <div class="brand">
        <strong>AI Knowledge</strong>
        <span>Search Platform</span>
      </div>

      <el-menu :default-active="route.path" router @select="handleSelect">
        <el-menu-item v-for="item in navItems" :key="item.path" :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="app-header">
        <div>
          <strong>智能文档搜索与知识库问答平台</strong>
          <span>Vue3 + TypeScript + Pinia</span>
        </div>
        <div class="header-actions">
          <el-tag v-if="userStore.isLoggedIn" type="success">{{ userStore.userInfo?.nickname }}</el-tag>
          <el-button v-if="userStore.isLoggedIn" :icon="SwitchButton" text @click="logout">退出</el-button>
          <el-button v-else type="primary" @click="router.push('/login')">登录</el-button>
        </div>
      </el-header>

      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
