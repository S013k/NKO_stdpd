'use client'

import React, { useState } from 'react'
import { Loader2, AlertCircle, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

interface FormData {
  username: string
  password: string
}

interface FormErrors {
  username?: string
  password?: string
  general?: string
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<{ username: boolean; password: boolean }>({
    username: false,
    password: false
  });

  const { login: authLogin } = useAuth()

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    if (name === 'username') {
      if (!value.trim()) {
        return 'Логин обязателен'
      }
      if (value.length < 3) {
        return 'Логин должен содержать минимум 3 символа'
      }
    }
    if (name === 'password') {
      if (!value) {
        return 'Пароль обязателен'
      }
      if (value.length < 6) {
        return 'Пароль должен содержать минимум 6 символов'
      }
    }
    return undefined
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name as keyof FormData, value)
      setErrors(prev => ({ ...prev, [name]: error, general: undefined }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name as keyof FormData, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    newErrors.username = validateField('username', formData.username)
    newErrors.password = validateField('password', formData.password)
    
    setErrors(newErrors)
    setTouched({ username: true, password: true })
    
    return !newErrors.username && !newErrors.password
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await authLogin(formData.username, formData.password)
      onClose()
      // Очищаем форму после успешного входа
      setFormData({ username: '', password: '' })
      setTouched({ username: false, password: false })
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : 'Ошибка входа' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setErrors({})
      setFormData({ username: '', password: '' })
      setTouched({ username: false, password: false })
      onClose()
    }
  }

  const handleSwitchToRegister = () => {
    if (!isLoading) {
      setErrors({})
      setFormData({ username: '', password: '' })
      setTouched({ username: false, password: false })
      onSwitchToRegister()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[440px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center" style={{ color: '#0066B3' }}>
            Вход в систему
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Войдите в свой аккаунт для продолжения
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {errors.general && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-foreground">
              Логин
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Введите ваш логин"
                value={formData.username}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={isLoading}
                className={`pl-10 h-11 ${
                  errors.username && touched.username
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : 'focus-visible:ring-[#0066B3]'
                }`}
              />
            </div>
            {errors.username && touched.username && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.username}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Пароль
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Введите ваш пароль"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={isLoading}
                className={`pl-10 h-11 ${
                  errors.password && touched.password
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : 'focus-visible:ring-[#0066B3]'
                }`}
              />
            </div>
            {errors.password && touched.password && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 text-base font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#0066B3' }}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Вход...
              </>
            ) : (
              'Войти'
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Нет аккаунта?
              </span>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleSwitchToRegister}
              disabled={isLoading}
              className="text-sm font-medium hover:underline"
              style={{ color: '#0066B3' }}
            >
              Зарегистрироваться
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}