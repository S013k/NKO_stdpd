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

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('click', handleClickOutside)
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 hover:bg-secondary rounded-lg transition-colors"
      >
        <UserAvatar size="sm" showInitials={true} />
        <ChevronDown
          className={`text-secondary transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className="user-dropdown">
          {/* Заголовок с информацией о пользователе */}
          <div className="user-info">
            <div className="user-name">{user.full_name}</div>
            <div className="user-role">@{user.login}</div>
          </div>

          {/* Пункты меню */}
          <div className="py-2">
            <button
              className="user-dropdown-item"
              onClick={() => {
                setIsOpen(false)
                // Здесь можно добавить переход в профиль
                console.log('Navigate to profile')
              }}
            >
              Мой профиль
            </button>

            <button
              className="user-dropdown-item"
              onClick={() => {
                setIsOpen(false)
                // Здесь можно добавить переход в настройки
                console.log('Navigate to settings')
              }}
            >
              Настройки
            </button>

            {(user.role === 'admin' || user.role === 'nko') && (
              <button
                className="user-dropdown-item"
                onClick={() => {
                  setIsOpen(false)
                  // Здесь можно добавить переход в панель управления
                  console.log('Navigate to admin panel')
                }}
              >
                Панель управления
              </button>
            )}
          </div>

          {/* Разделитель */}
          <div className="border-t border-border my-2"></div>

          {/* Кнопка выхода */}
          <button
            onClick={handleLogout}
            className="user-dropdown-item danger"
          >
            Выйти
          </button>

          {/* Футер с дополнительной информацией */}
          <div className="px-4 py-2 border-t border-border mt-2">
            <p className="text-xs text-secondary text-center">
              Портал Добрые дела Росатома
            </p>
          </div>
        </div>
      )}
    </div>
  )
}