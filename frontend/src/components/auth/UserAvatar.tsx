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
      <div className={`user-avatar ${className}`}>
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
          user-avatar
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
      
      {/* Tooltip с информацией о пользователе */}
      <div className="user-dropdown">
        <div className="user-info">
          <div className="user-name">{user.full_name}</div>
          <div className="user-role">@{user.login}</div>
        </div>
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