import type {
  AskQuestionPayload,
  DocumentSummary,
  GenerateInterviewPayload,
  GenerateSummaryPayload,
  InterviewQuestion,
} from '../types'
import { createId } from '../utils/format'
import { createTextReadableStream, sleep } from '../utils/stream'

const pickKeywords = (content: string) => {
  const words = content
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9_\s-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 2)

  const preferred = ['Vue', 'TypeScript', 'Pinia', 'Router', 'AI', 'Markdown', 'Stream', 'Mock']
  const merged = [...preferred, ...words]
  return Array.from(new Set(merged)).slice(0, 8)
}

export const generateSummary = async ({ document }: GenerateSummaryPayload): Promise<DocumentSummary> => {
  await sleep(900)

  const keywords = pickKeywords(document.content)
  const preview = document.content.trim().slice(0, 140)

  return {
    docId: document.id,
    overview: `该文档围绕「${document.name}」展开，核心内容包括资料整理、知识点提炼和可复用的项目表达。系统已根据文本结构生成摘要，便于后续问答、面试复盘和简历材料沉淀。文档开头内容参考：${preview}`,
    keywords,
    knowledgePoints: [
      '如何将非结构化文本转换为可搜索、可问答的知识材料',
      '如何通过前端状态管理保存当前文档、摘要结果和历史记录',
      '如何设计可中断的 AI 生成流程，避免用户等待失控',
      '如何把 Markdown 文档内容渲染为更易阅读的知识卡片',
    ],
    resumeHighlights: [
      '基于 Vue3 + TypeScript 设计智能文档搜索与问答平台，完成上传、摘要、问答、历史记录等核心模块',
      '封装 UploadPanel、ChatBox 等复用组件，实现文件校验、内容预览、流式输出和请求中断',
      '使用 Pinia + localStorage 管理登录态、文档态、问答记录和主题设置，提升前端状态一致性',
      '预留 OpenAI 兼容 API 接入层，当前通过 mock AI 服务模拟真实异步生成流程',
    ],
    createdAt: new Date().toISOString(),
  }
}

export const askDocumentQuestion = async (
  { document, question }: AskQuestionPayload,
  signal?: AbortSignal,
): Promise<ReadableStream<Uint8Array>> => {
  await sleep(350, signal)

  const keywords = pickKeywords(document.content).join('、')
  const answer = `### 回答\n\n基于当前文档 **${document.name}**，你的问题是：**${question}**。\n\n从文档内容来看，可以优先从以下角度回答：\n\n1. **背景与目标**：说明这个文档解决了什么问题，以及为什么需要整理成知识库。\n2. **核心实现**：围绕 ${keywords} 等关键词展开，突出上传解析、状态管理、AI 生成和历史持久化。\n3. **可复盘价值**：这个平台可以帮助学生、实习求职者和实验项目把零散文档沉淀为可检索知识。\n\n> 面试表达建议：先讲业务场景，再讲你负责的前端模块，最后补充流式输出、AbortController 和 localStorage 持久化这些工程细节。\n\n如果继续深挖，可以追问：这个回答中的数据流如何从上传页传递到问答页？`

  return createTextReadableStream(answer, { signal, chunkSize: 2, interval: 24 })
}

export const generateInterviewQuestions = async ({
  document,
  projectDescription,
  mode,
}: GenerateInterviewPayload): Promise<InterviewQuestion[]> => {
  await sleep(850)

  const sourceTitle = document?.name || '项目描述'
  const sourceText = document?.content || projectDescription || '智能文档搜索与知识库问答平台'
  const keyword = pickKeywords(sourceText)[0] || '前端工程'

  const modeLabelMap: Record<typeof mode, string> = {
    basic: '基础型',
    deep: '项目深挖型',
    pressure: '压力面试型',
  }

  return [
    {
      id: createId('interview'),
      mode,
      question: `${modeLabelMap[mode]}：你为什么要做 AI Knowledge Search 这个项目？`,
      answer: `我选择这个项目是因为它覆盖了前端实习常见能力：上传校验、组件拆分、路由权限、状态管理、流式交互和错误处理。相比只做静态页面，它更能展示完整业务闭环。`,
      followUps: ['如果没有真实大模型 API，项目价值体现在哪里？', '你如何保证 mock 层后续可以平滑替换？'],
      knowledgeGaps: ['业务场景抽象', '前端工程分层', 'API 适配设计'],
    },
    {
      id: createId('interview'),
      mode,
      question: `如果面试官追问 ${sourceTitle} 的核心数据流，你怎么讲？`,
      answer: `数据流可以从上传开始讲：UploadPanel 读取文件并生成 DocumentInfo，document store 保存当前文档，Summary/Chat/Interview 页面基于当前文档调用 api/ai.ts，结果再写入对应 store 和 history store，最后通过 localStorage 做持久化。`,
      followUps: ['刷新页面后数据为什么还在？', 'Pinia store 与 localStorage 的边界是什么？'],
      knowledgeGaps: ['Pinia action 设计', '持久化恢复', '跨页面状态共享'],
    },
    {
      id: createId('interview'),
      mode,
      question: `这个项目里 ${keyword} 相关的技术难点是什么？`,
      answer: `难点在于把 AI 交互做成真实产品体验：生成时要有 loading 和 streaming 状态，用户可以停止生成，失败时可以重试，回答内容需要支持 Markdown 渲染和复制。`,
      followUps: ['AbortController 的工作原理是什么？', '流式输出和普通 Promise 返回有什么区别？'],
      knowledgeGaps: ['ReadableStream', 'AbortController', '异步状态机'],
    },
    {
      id: createId('interview'),
      mode,
      question: mode === 'pressure' ? '如果线上出现 AI 回答卡死，你会怎么定位？' : '你如何处理上传失败和 AI 请求失败？',
      answer: `我会把错误分层处理：上传阶段校验文件类型、大小和空内容；AI 阶段捕获请求异常和中断异常；UI 层通过 ErrorState、ElMessage 和重试按钮给出恢复路径。`,
      followUps: ['如何区分用户主动停止和网络异常？', '错误状态应该放在组件里还是 store 里？'],
      knowledgeGaps: ['异常分类', '用户体验兜底', '组件状态设计'],
    },
  ]
}
