export type ThemeMode = 'light' | 'dark'

export type AiRequestStatus = 'idle' | 'loading' | 'streaming' | 'success' | 'error'

export interface UserInfo {
  username: string
  nickname: string
  role: 'student' | 'candidate' | 'admin'
  loginAt: string
}

export interface DocumentInfo {
  id: string
  name: string
  size: number
  type: string
  extension: string
  content: string
  createdAt: string
  status: 'uploaded' | 'failed'
  errorMessage?: string
}

export interface DocumentSummary {
  docId: string
  overview: string
  keywords: string[]
  knowledgePoints: string[]
  resumeHighlights: string[]
  createdAt: string
}

export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
  status: AiRequestStatus
  errorMessage?: string
}

export type InterviewMode = 'basic' | 'deep' | 'pressure'

export interface InterviewQuestion {
  id: string
  mode: InterviewMode
  question: string
  answer: string
  followUps: string[]
  knowledgeGaps: string[]
}

export type HistoryRecordType = 'document' | 'summary' | 'chat' | 'interview'

export interface HistoryRecord {
  id: string
  type: HistoryRecordType
  title: string
  description: string
  createdAt: string
  payload?: DocumentInfo | DocumentSummary | ChatMessage[] | InterviewQuestion[] | Record<string, unknown>
}

export interface FileValidationResult {
  valid: boolean
  message?: string
}

export interface GenerateSummaryPayload {
  document: DocumentInfo
}

export interface AskQuestionPayload {
  document: DocumentInfo
  question: string
}

export interface GenerateInterviewPayload {
  document?: DocumentInfo | null
  projectDescription?: string
  mode: InterviewMode
}

export interface OpenAICompatibleConfig {
  baseURL: string
  model: string
  apiKey?: string
}
