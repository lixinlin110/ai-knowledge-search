import { defineStore } from 'pinia'
import type { UserInfo } from '../types'
import { getStorage, removeStorage, setStorage } from '../utils/storage'

const TOKEN_KEY = 'token'
const USER_KEY = 'user_info'

interface UserState {
  token: string
  userInfo: UserInfo | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: getStorage(TOKEN_KEY, ''),
    userInfo: getStorage<UserInfo | null>(USER_KEY, null),
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token),
  },
  actions: {
    async login(username: string, password: string) {
      if (!username.trim() || !password.trim()) {
        throw new Error('请输入用户名和密码')
      }

      // mock 登录：真实项目中这里应替换为后端登录接口。
      const userInfo: UserInfo = {
        username,
        nickname: username,
        role: 'candidate',
        loginAt: new Date().toISOString(),
      }
      const token = `mock_token_${Date.now()}`

      this.userInfo = userInfo
      this.token = token
      setStorage(USER_KEY, userInfo)
      setStorage(TOKEN_KEY, token)
    },
    logout() {
      this.userInfo = null
      this.token = ''
      removeStorage(USER_KEY)
      removeStorage(TOKEN_KEY)
    },
  },
})
