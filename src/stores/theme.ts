import { defineStore } from 'pinia'
import type { ThemeMode } from '../types'
import { getStorage, setStorage } from '../utils/storage'

const THEME_KEY = 'theme_mode'

interface ThemeState {
  mode: ThemeMode
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    mode: getStorage<ThemeMode>(THEME_KEY, 'light'),
  }),
  actions: {
    applyTheme() {
      document.documentElement.dataset.theme = this.mode
    },
    setTheme(mode: ThemeMode) {
      this.mode = mode
      setStorage(THEME_KEY, mode)
      this.applyTheme()
    },
  },
})
