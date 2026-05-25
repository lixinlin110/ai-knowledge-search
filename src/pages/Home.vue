<script setup lang="ts">
import { ChatDotRound, DocumentAdd, MagicStick, Timer } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const features = [
  { icon: DocumentAdd, title: '文档上传校验', desc: '支持 txt、md 上传，校验类型、大小和空文件，上传后展示内容预览。' },
  { icon: MagicStick, title: 'AI 摘要提炼', desc: '根据文档生成 mock 摘要、关键词、知识点和简历亮点。' },
  { icon: ChatDotRound, title: '流式文档问答', desc: '模拟真实 AI 逐字输出，支持停止生成、重新生成、复制回答和错误重试。' },
  { icon: Timer, title: '历史记录持久化', desc: '用 Pinia + localStorage 保存文档、摘要、问答和面试追问记录。' },
]

const stacks = ['Vue3', 'TypeScript', 'Vite', 'Vue Router', 'Pinia', 'Element Plus', 'Axios', 'Fetch ReadableStream', 'markdown-it']
</script>

<template>
  <main class="page">
    <section class="hero-band">
      <div>
        <p class="eyebrow">Frontend Intern Project</p>
        <h1>AI Knowledge Search</h1>
        <p>
          一个适合前端实习简历展示的完整项目：覆盖文件上传、AI 对话、流式输出、请求中断、状态管理、路由权限和本地持久化。
        </p>
        <div class="hero-actions">
          <el-button type="primary" size="large" @click="router.push(userStore.isLoggedIn ? '/upload' : '/login')">
            开始使用
          </el-button>
          <el-button size="large" plain @click="router.push('/summary')">查看摘要页</el-button>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="section-title">
        <p class="eyebrow">Core Features</p>
        <h2>核心功能</h2>
      </div>
      <div class="feature-grid">
        <article v-for="feature in features" :key="feature.title" class="feature-card">
          <el-icon><component :is="feature.icon" /></el-icon>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.desc }}</p>
        </article>
      </div>
    </section>

    <section class="content-section two-column">
      <div>
        <div class="section-title">
          <p class="eyebrow">Tech Stack</p>
          <h2>技术栈</h2>
        </div>
        <div class="stack-list">
          <el-tag v-for="stack in stacks" :key="stack" effect="plain">{{ stack }}</el-tag>
        </div>
      </div>

      <div>
        <div class="section-title">
          <p class="eyebrow">Workflow</p>
          <h2>使用流程</h2>
        </div>
        <el-steps direction="vertical" :active="4">
          <el-step title="登录系统" description="mock token 写入 localStorage，触发路由守卫放行。" />
          <el-step title="上传文档" description="读取 txt/md 内容，生成当前文档状态和历史记录。" />
          <el-step title="生成摘要" description="调用 mock AI API，展示摘要、关键词、知识点和简历亮点。" />
          <el-step title="文档问答" description="使用 ReadableStream 模拟流式输出，支持 AbortController 中断。" />
        </el-steps>
      </div>
    </section>
  </main>
</template>
