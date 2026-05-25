import { defineStore } from 'pinia'
import type { HistoryRecord } from '../types'
import { createId } from '../utils/format'
import { getStorage, setStorage } from '../utils/storage'

const HISTORY_KEY = 'history_records'

type HistoryInput = Omit<HistoryRecord, 'id' | 'createdAt'>

interface HistoryState {
  records: HistoryRecord[]
}

export const useHistoryStore = defineStore('history', {
  state: (): HistoryState => ({
    records: getStorage<HistoryRecord[]>(HISTORY_KEY, []),
  }),
  getters: {
    documentRecords: (state) => state.records.filter((item) => item.type === 'document'),
    chatRecords: (state) => state.records.filter((item) => item.type === 'chat'),
  },
  actions: {
    persist() {
      setStorage(HISTORY_KEY, this.records)
    },
    addRecord(record: HistoryInput) {
      const next: HistoryRecord = {
        ...record,
        id: createId('history'),
        createdAt: new Date().toISOString(),
      }

      this.records.unshift(next)
      this.records = this.records.slice(0, 60)
      this.persist()
    },
    deleteRecord(id: string) {
      this.records = this.records.filter((item) => item.id !== id)
      this.persist()
    },
    clearRecords() {
      this.records = []
      this.persist()
    },
  },
})
