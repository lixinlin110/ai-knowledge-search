<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)
const form = reactive({
  username: 'frontend_intern',
  password: '123456',
})

const login = async () => {
  try {
    loading.value = true
    await userStore.login(form.username, form.password)
    ElMessage.success('登录成功')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/home'
    router.replace(redirect)
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-visual">
      <p class="eyebrow">AI Knowledge Search</p>
      <h1>智能文档搜索与知识库问答平台</h1>
      <p>面向学生、科研实验和实习求职场景，把零散文档整理成可摘要、可问答、可复盘的知识库。</p>
    </section>

    <section class="login-panel">
      <h2>Mock 登录</h2>
      <p class="muted">登录态会写入 localStorage，用于演示路由权限控制。</p>

      <el-form label-position="top" @submit.prevent="login">
        <el-form-item label="用户名">
          <el-input v-model="form.username" :prefix-icon="User" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" :prefix-icon="Lock" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-button type="primary" size="large" :loading="loading" @click="login">进入系统</el-button>
      </el-form>
    </section>
  </main>
</template>
