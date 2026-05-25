import { defineStore } from 'pinia'
import type { AiRequestStatus, DocumentInfo, DocumentSummary } from '../types'
import { getStorage, removeStorage, setStorage } from '../utils/storage'

const DOCUMENT_KEY = 'current_document'
const SUMMARY_KEY = 'document_summary'

interface DocumentState {
  currentDocument: DocumentInfo | null
  summary: DocumentSummary | null
  summaryStatus: AiRequestStatus
  errorMessage: string
}

export const useDocumentStore = defineStore('document', {
  state: (): DocumentState => ({
    currentDocument: getStorage<DocumentInfo | null>(DOCUMENT_KEY, null),
    summary: getStorage<DocumentSummary | null>(SUMMARY_KEY, null),
    summaryStatus: 'idle',
    errorMessage: '',
  }),
  actions: {
    setDocument(document: DocumentInfo) {
      this.currentDocument = document
      this.summary = null
      this.errorMessage = ''
      setStorage(DOCUMENT_KEY, document)
      removeStorage(SUMMARY_KEY)
    },
    setSummary(summary: DocumentSummary) {
      this.summary = summary
      this.summaryStatus = 'success'
      setStorage(SUMMARY_KEY, summary)
    },
    setSummaryStatus(status: AiRequestStatus, message = '') {
      this.summaryStatus = status
      this.errorMessage = message
    },
    clearDocument() {
      this.currentDocument = null
      this.summary = null
      this.summaryStatus = 'idle'
      this.errorMessage = ''
      removeStorage(DOCUMENT_KEY)
      removeStorage(SUMMARY_KEY)
    },
  },
})
