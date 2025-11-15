'use client'

import { Header } from '@/components/Header'
import { NewsCard } from '@/components/NewsCard'
import { Footer } from '@/components/Footer'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, Filter, Calendar } from 'lucide-react'
import { newsData, newsCategories } from '@/data/news'
import { useState, useMemo } from 'react'

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredNews = useMemo(() => {
    return newsData.filter(news => {
      const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           news.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           news.content.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Заголовок страницы */}
      <section className="bg-[var(--color-bg-secondary)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
              Новости
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
              Будьте в курсе последних событий, инициативных проектов и грантов в городах присутствия Росатома
            </p>
          </div>
          
          {/* Фильтры */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Поиск */}
              <div className="md:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--color-text-secondary)]" />
                  <Input
                    placeholder="Поиск новостей..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-[var(--color-border)] focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>
              
              {/* Фильтр по категории */}
              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-[var(--color-border)] focus:ring-[var(--color-primary)]">
                    <SelectValue placeholder="Все категории" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все категории</SelectItem>
                    {newsCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Сброс фильтров */}
              <div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}
                  className="w-full btn-secondary"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Сбросить
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Результаты поиска */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Количество результатов */}
          <div className="mb-8">
            <p className="text-[var(--color-text-secondary)]">
              Найдено новостей: <span className="font-semibold text-[var(--color-text-primary)]">{filteredNews.length}</span>
            </p>
          </div>

          {/* Сетка карточек */}
          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-[var(--color-bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-[var(--color-text-secondary)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                Новости не найдены
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-6">
                Попробуйте изменить параметры поиска или фильтры
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="btn-primary"
              >
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Подписка на новости */}
      <section className="py-16 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Подпишитесь на новости
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Получайте последние новости и анонсы мероприятий на вашу электронную почту
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Ваш email..."
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/70 focus:ring-white"
            />
            <Button className="bg-white text-[var(--color-primary)] hover:bg-gray-100">
              Подписаться
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}