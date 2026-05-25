# AI Knowledge Search

智能文档搜索与知识库问答平台。项目面向学生、实习求职者、科研实验记录和项目复盘场景，支持上传 Markdown / txt 文档，基于文档内容生成摘要、关键词、知识点、简历亮点，并提供 mock AI 文档问答、面试追问生成和历史记录管理。

> 当前版本不接入真实大模型 API，使用前端 mock AI 服务模拟异步生成、流式输出和请求中断。项目已预留 OpenAI 兼容 API 接入位置，不包含任何真实 API Key。

## 项目背景

很多学习、科研和求职材料都散落在 README、实验报告、论文笔记和复盘文档中。AI Knowledge Search 希望把这些非结构化文本整理成可摘要、可问答、可复盘的知识材料。

本项目重点不是大模型算法，而是完整展示前端工程能力：Vue3 + TypeScript 项目组织、组件化拆分、文件上传校验、AI 对话交互、流式输出、请求中断、Pinia 状态管理、路由权限、本地持久化和错误处理。

## 技术栈

- Vue3
- TypeScript
- Vite
- Vue Router
- Pinia
- Element Plus
- Axios
- Fetch ReadableStream / AbortController
- markdown-it
- localStorage

## 功能列表

- Mock 登录：登录成功后保存 token 到 localStorage。
- 路由权限：未登录访问上传、摘要、问答、面试、历史和设置页时自动跳转登录页。
- 首页：展示项目介绍、核心功能、技术栈和使用流程。
- 文档上传：支持拖拽和点击上传，支持 txt / md 文件，校验文件类型、大小和空内容。
- 文档预览：展示文件名、大小、类型、上传时间和文本内容预览。
- AI 摘要：生成 mock 摘要、关键词、核心知识点和简历亮点。
- 文档问答：基于当前文档生成 mock AI 回答，支持 Markdown 渲染。
- 流式输出：使用 ReadableStream 模拟逐字输出。
- 请求中断：使用 AbortController 支持停止生成。
- 回答操作：支持重新生成、复制回答、失败重试。
- 面试追问：支持基础型、项目深挖型、压力面试型三种模式。
- 历史记录：展示文档、摘要、问答、面试记录，支持查看详情、删除单条和清空全部。
- 设置页：支持亮色 / 暗色主题切换、清空本地缓存、查看登录状态。

## 项目目录结构

```text
src/
  api/
    ai.ts
    request.ts
  assets/
  components/
    common/
      EmptyState.vue
      ErrorState.vue
      LoadingState.vue
    upload/
      UploadPanel.vue
      DocumentPreview.vue
    chat/
      ChatBox.vue
      ChatMessage.vue
      ChatInput.vue
    summary/
      SummaryCard.vue
      KeywordList.vue
    interview/
      QuestionList.vue
      QuestionCard.vue
  pages/
    Login.vue
    Home.vue
    Upload.vue
    Summary.vue
    Chat.vue
    Interview.vue
    History.vue
    Settings.vue
  router/
    index.ts
  stores/
    user.ts
    document.ts
    chat.ts
    history.ts
    theme.ts
  types/
    index.ts
  utils/
    file.ts
    storage.ts
    stream.ts
    format.ts
  App.vue
  main.ts
```

## 启动方式

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 核心实现思路

### 1. 文件上传与校验

`UploadPanel.vue` 封装拖拽上传和点击上传逻辑，上传前通过 `utils/file.ts` 校验文件类型、文件大小和空文件。读取成功后生成 `DocumentInfo`，写入 `document store`，并同步记录到历史记录。

### 2. Mock AI 服务分层

AI 相关逻辑集中在 `api/ai.ts`：

- `generateSummary`：模拟摘要生成。
- `askDocumentQuestion`：返回 `ReadableStream`，模拟流式问答。
- `generateInterviewQuestions`：生成结构化面试追问。

组件不直接写 mock 文案，方便后续替换为真实 OpenAI 兼容 API。

### 3. 流式输出和请求中断

`utils/stream.ts` 使用 `ReadableStream` 和 `TextEncoder` 模拟分片输出，`ChatBox.vue` 使用 `AbortController` 控制生成生命周期。用户点击“停止生成”时触发 `abort()`，并将当前回答标记为已停止。

### 4. 状态管理和持久化

项目使用 Pinia 管理登录态、当前文档、摘要结果、聊天消息、历史记录和主题设置。每个 store 在关键 action 中同步 localStorage，刷新页面后仍能恢复状态。

### 5. 路由权限

`router/index.ts` 中配置 `beforeEach` 守卫。需要登录的页面统一配置 `meta.requiresAuth`，未登录访问时跳转到登录页，并通过 `redirect` 参数在登录后返回原页面。

## 项目亮点

- 完整前端业务闭环：登录、上传、摘要、问答、面试追问、历史记录、设置。
- 组件化拆分清晰：上传、聊天、摘要、面试、空状态和错误状态独立封装。
- AI 交互体验完整：loading、streaming、error、retry、copy、abort 状态齐全。
- TypeScript 类型覆盖核心数据：用户、文档、摘要、聊天消息、面试问题、历史记录和主题模式。
- mock API 与 UI 解耦，保留 OpenAI 兼容 API 接入点，后续扩展成本低。

## 简历描述示例

AI Knowledge Search：基于 Vue3 + TypeScript 实现智能文档搜索与知识库问答平台，支持文档上传校验、内容预览、AI 摘要、流式问答、请求中断、面试追问和历史记录持久化。项目使用 Pinia 管理登录态、文档态、聊天消息和主题设置，使用 Vue Router 实现权限守卫，封装 UploadPanel、ChatBox、SummaryCard 等组件，并通过 ReadableStream + AbortController 模拟真实 AI 生成体验。

## 面试官可能追问的问题

1. 为什么选择这个项目作为前端实习作品？
2. 这个项目和普通静态后台页面相比，前端难点在哪里？
3. UploadPanel 是如何做文件类型、大小和空内容校验的？
4. FileReader 读取文件时有哪些异常场景？
5. 为什么要把 mock AI 接口放在 api/ai.ts，而不是直接写在组件里？
6. ReadableStream 是如何实现流式输出的？
7. AbortController 如何停止生成？
8. 如何区分用户主动停止和请求失败？
9. ChatBox 的 loading、streaming、error 状态是怎么设计的？
10. Pinia store 和 localStorage 分别负责什么？
11. 刷新页面后，为什么文档和历史记录还能恢复？
12. 路由守卫是如何判断用户是否登录的？
13. 如果后续接入真实 OpenAI API，你会改哪些文件？
14. markdown-it 渲染 Markdown 时要注意什么安全问题？
15. 历史记录为什么要做数量限制？
16. 亮色 / 暗色主题是怎么实现的？
17. 如果文件非常大，前端上传和预览要怎么优化？
18. 如果 AI 回答很长，聊天列表性能怎么优化？
19. Element Plus 在项目中承担了哪些 UI 能力？
20. 这个项目还可以如何继续迭代？

## 后续优化方向

- 接入真实 OpenAI 兼容接口，使用环境变量管理 API Key。
- 支持 PDF 解析，可接入 pdf.js 提取文本。
- 增加文档列表和多文档切换。
- 增加关键词搜索和段落定位。
- 增加 IndexedDB，支持更大规模本地文档存储。
- 增加 Vitest 单元测试和 Playwright 端到端测试。
- 增加响应式移动端适配。
- 增加虚拟列表优化长对话渲染性能。

## AI 辅助开发说明

本项目初版代码使用 AI 辅助生成，但项目重点在于本人对前端工程链路的理解和完善，包括组件拆分、状态管理、路由权限、上传校验、流式输出、请求中断、错误处理和项目文档沉淀。后续可继续在真实 API 接入、测试覆盖、性能优化和 UI 细节上迭代。
