'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: number
  full_name: string
  login: string
  role: 'nko' | 'admin' | 'moder' | 'user'
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (login: string, password: string) => Promise<void>
  register: (full_name: string, login: string, password: string, role: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Проверка авторизации при загрузке
  useEffect(() => {
    refreshUser()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)

      const apiUrl = process.env.NODE_ENV === 'production' ? '/api/auth/login' : 'http://localhost:8000/auth/login'
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Важно для cookie
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Ошибка входа')
      }

      await refreshUser()
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (full_name: string, username: string, password: string, role: string) => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production' ? '/api/auth/register' : 'http://localhost:8000/auth/register'
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name,
          login,
          password,
          role,
        }),
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Ошибка регистрации')
      }

      // После регистрации сразу входим
      await login(username, password)
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // Очищаем cookie на сервере (если есть эндпоинт для logout)
      const apiUrl = process.env.NODE_ENV === 'production' ? '/api/auth/logout' : 'http://localhost:8000/auth/logout'
      await fetch(apiUrl, {
        method: 'POST',
        credentials: 'include',
      }).catch(() => {
        // Игнорируем ошибку, если эндпоинт не существует
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
    }
  }

  const refreshUser = async () => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production' ? '/api/users/me/' : 'http://localhost:8000/users/me/'
      const response = await fetch(apiUrl, {
        credentials: 'include',
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Refresh user error:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}