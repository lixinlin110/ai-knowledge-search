import axios from 'axios'
import type { OpenAICompatibleConfig } from '../types'

export const request = axios.create({
  baseURL: '/mock-api',
  timeout: 15_000,
})

request.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(error),
)

// 后续接入真实 OpenAI 兼容接口时，只需要替换 baseURL/model，并从环境变量读取 API Key。
export const openAICompatibleConfig: OpenAICompatibleConfig = {
  baseURL: import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1',
  model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
}
