'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, User, Settings, LogOut, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserAvatar } from './UserAvatar'
import { useAuth } from '@/contexts/AuthContext'

interface UserDropdownProps {
  className?: string
}

export function UserDropdown({ className = '' }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleLogout = async () => {
    setIsOpen(false)
    await logout()
  }

  const getRoleLabel = (role: string): string => {
    switch (role) {
      case 'nko':
        return 'НКО'
      case 'admin':
        return 'Администратор'
      case 'moder':
        return 'Модератор'
      case 'user':
        return 'Пользователь'
      default:
        return role
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'nko':
        return <Building className="h-4 w-4" />
      case 'admin':
      case 'moder':
        return <Settings className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Кнопка триггера */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <UserAvatar size="sm" showInitials={true} />
        <ChevronDown 
          className={`h-4 w-4 text-[var(--color-text-secondary)] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </Button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-[var(--color-border)] py-2 z-50">
          {/* Заголовок с информацией о пользователе */}
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <div className="flex items-center space-x-3">
              <UserAvatar size="md" showInitials={true} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {user.full_name}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] truncate">
                  @{user.login}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  {getRoleIcon(user.role)}
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {getRoleLabel(user.role)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Пункты меню */}
          <div className="py-2">
            <button
              className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-gray-100 transition-colors flex items-center space-x-3"
              onClick={() => {
                setIsOpen(false)
                // Здесь можно добавить переход в профиль
                console.log('Navigate to profile')
              }}
            >
              <User className="h-4 w-4 text-[var(--color-text-secondary)]" />
              <span>Мой профиль</span>
            </button>

            <button
              className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-gray-100 transition-colors flex items-center space-x-3"
              onClick={() => {
                setIsOpen(false)
                // Здесь можно добавить переход в настройки
                console.log('Navigate to settings')
              }}
            >
              <Settings className="h-4 w-4 text-[var(--color-text-secondary)]" />
              <span>Настройки</span>
            </button>

            {(user.role === 'admin' || user.role === 'nko') && (
              <button
                className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-gray-100 transition-colors flex items-center space-x-3"
                onClick={() => {
                  setIsOpen(false)
                  // Здесь можно добавить переход в панель управления
                  console.log('Navigate to admin panel')
                }}
              >
                <Building className="h-4 w-4 text-[var(--color-text-secondary)]" />
                <span>Панель управления</span>
              </button>
            )}
          </div>

          {/* Разделитель */}
          <div className="border-t border-[var(--color-border)] my-2"></div>

          {/* Кнопка выхода */}
          <div className="px-2">
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center space-x-3"
            >
              <LogOut className="h-4 w-4" />
              <span>Выйти</span>
            </button>
          </div>

          {/* Футер с дополнительной информацией */}
          <div className="px-4 py-2 border-t border-[var(--color-border)] mt-2">
            <p className="text-xs text-[var(--color-text-secondary)] text-center">
              Портал Добрые дела Росатома
            </p>
          </div>
        </div>
      )}
    </div>
  )
}