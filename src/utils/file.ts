import type { DocumentInfo, FileValidationResult } from '../types'
import { createId } from './format'

export const ACCEPTED_EXTENSIONS = ['txt', 'md']
export const MAX_FILE_SIZE = 2 * 1024 * 1024

export const getFileExtension = (fileName: string) => {
  const extension = fileName.split('.').pop()
  return extension ? extension.toLowerCase() : ''
}

export const validateFile = (
  file: File,
  acceptedExtensions = ACCEPTED_EXTENSIONS,
  maxSize = MAX_FILE_SIZE,
): FileValidationResult => {
  const extension = getFileExtension(file.name)

  if (!file.size) {
    return { valid: false, message: '文件内容为空，请上传有内容的 txt 或 md 文件' }
  }

  if (!acceptedExtensions.includes(extension)) {
    return { valid: false, message: `暂不支持 .${extension || 'unknown'} 文件，请上传 txt 或 md 文件` }
  }

  if (file.size > maxSize) {
    return { valid: false, message: `文件大小不能超过 ${(maxSize / 1024 / 1024).toFixed(0)}MB` }
  }

  return { valid: true }
}

export const readTextFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : ''
      if (!content.trim()) {
        reject(new Error('文件内容为空，请换一个文档再试'))
        return
      }
      resolve(content)
    }

    reader.onerror = () => reject(new Error('文件读取失败，请重新上传'))
    reader.readAsText(file, 'utf-8')
  })

export const createDocumentInfo = (file: File, content: string): DocumentInfo => ({
  id: createId('doc'),
  name: file.name,
  size: file.size,
  type: file.type || 'text/plain',
  extension: getFileExtension(file.name),
  content,
  createdAt: new Date().toISOString(),
  status: 'uploaded',
})
