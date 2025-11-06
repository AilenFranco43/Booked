'use client'

import { checkToken, loginUser } from "@/services/auth.service"
import { useBoundStore } from "@/store/bound.store"

export const useAuth = () => {
  const user = useBoundStore(state => state.user)
  const login = useBoundStore(state => state.login)
  const logout = useBoundStore(state => state.logout)
  const checking = useBoundStore(state => state.checking)
  const status = useBoundStore(state => state.status)

  const loginWithCredentials = async (data) => {
    checking()
    try {

      const { user, token } = await loginUser(data)

      window.localStorage.setItem('token', token)
      login(user)
    } catch (error) {
      logout()
      throw error
    }
  }

  const checkAuthStatus = async (currentToken) => {
    checking()

    try {

      const { user, token } = await checkToken(currentToken)

      window.localStorage.setItem('token', token)

      login(user)
    } catch (error) {
      logout()
      throw error
    }
  }

  return {
    loginWithCredentials,
    checkAuthStatus,
    user,
    status,
    logout
  }
}
