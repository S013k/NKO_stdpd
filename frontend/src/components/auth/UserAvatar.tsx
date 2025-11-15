'use client'

import React from 'react'
import { RosatomLogo } from '@/components/RosatomLogo'
import { useAuth } from '@/contexts/AuthContext'

interface UserAvatarProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showInitials?: boolean
}

export function UserAvatar({ 
  className = '', 
  size = 'md',
  showInitials = true 
}: UserAvatarProps) {
  const { user } = useAuth()

  if (!user) {
    // Показываем логотип Росатома как фоллбэк для неавторизованных пользователей
    return (
      <div className={`rounded-full bg-white border-2 border-[var(--color-primary)] flex items-center justify-center ${className}`}>
        <RosatomLogo
          type="horizontalColor"
          width={getSizeWidth(size)}
          height={getSizeHeight(size)}
          className="p-1"
        />
      </div>
    )
  }

  // Получаем инициалы пользователя
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ')
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase()
    }
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase()
  }

  const initials = getInitials(user.full_name)
  const avatarSize = getSizeClass(size)

  return (
    <div className={`relative group ${className}`}>
      <div 
        className={`
          ${avatarSize}
          rounded-full 
          bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)]
          flex 
          items-center 
          justify-center 
          text-white 
          font-semibold
          border-2 
          border-white
          shadow-lg
          transition-all
          duration-200
          hover:shadow-xl
          hover:scale-105
          cursor-pointer
        `}
        title={user.full_name}
      >
        {showInitials ? (
          <span className={getInitialsSize(size)}>
            {initials}
          </span>
        ) : (
          <RosatomLogo
            type="horizontalColor"
            width={getSizeWidth(size)}
            height={getSizeHeight(size)}
            className="p-1"
          />
        )}
      </div>
      
      {/* Индикатор онлайн статуса */}
      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
      
      {/* Tooltip с информацией о пользователе */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        <div className="font-medium">{user.full_name}</div>
        <div className="text-xs text-gray-300">@{user.login}</div>
        <div className="text-xs text-gray-400 capitalize">{user.role}</div>
        {/* Стрелочка */}
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  )
}

function getSizeClass(size: 'sm' | 'md' | 'lg'): string {
  switch (size) {
    case 'sm':
      return 'w-8 h-8'
    case 'md':
      return 'w-10 h-10'
    case 'lg':
      return 'w-12 h-12'
    default:
      return 'w-10 h-10'
  }
}

function getSizeWidth(size: 'sm' | 'md' | 'lg'): number {
  switch (size) {
    case 'sm':
      return 24
    case 'md':
      return 32
    case 'lg':
      return 40
    default:
      return 32
  }
}

function getSizeHeight(size: 'sm' | 'md' | 'lg'): number {
  switch (size) {
    case 'sm':
      return 12
    case 'md':
      return 16
    case 'lg':
      return 20
    default:
      return 16
  }
}

function getInitialsSize(size: 'sm' | 'md' | 'lg'): string {
  switch (size) {
    case 'sm':
      return 'text-xs'
    case 'md':
      return 'text-sm'
    case 'lg':
      return 'text-base'
    default:
      return 'text-sm'
  }
}